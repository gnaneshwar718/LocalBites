const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export const PlacesApi = {
  apiKey: null,
  setApiKey(key) {
    this.apiKey = key;
  },

  async fetchRestaurants({ lat = 12.9716, lng = 77.5946, radius = 5000 } = {}) {
    try {
      console.log('Fetching from Google Places API...');
      const response = await fetch(BASE_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask':
            'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.location,places.photos,places.priceLevel,places.editorialSummary,places.regularOpeningHours,places.currentOpeningHours,places.servesBreakfast,places.servesLunch,places.servesDinner,places.nationalPhoneNumber,places.websiteUri',
        },
        body: JSON.stringify({
          includedTypes: ['restaurant'],
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lng,
              },
              radius: radius,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const data = await response.json();
      console.log('API Response:', data);
      if (!data.places || data.places.length === 0) {
        console.warn('No places found in API response.');
        return [];
      }
      return this.transformData(data.places);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      throw error;
    }
  },

  getPhotoUrl(photoName) {
    if (!photoName) return null;
    return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${this.apiKey}`;
  },

  deriveCuisine(place) {
    const types = place.types || [];
    const name = (place.displayName?.text || '').toLowerCase();

    if (types.includes('south_indian_restaurant')) return 'South Indian';
    if (types.includes('north_indian_restaurant')) return 'North Indian';
    if (types.includes('indian_restaurant')) return 'Indian';
    if (types.includes('chinese_restaurant')) return 'Chinese';
    if (types.includes('italian_restaurant')) return 'Italian';
    if (types.includes('mexican_restaurant')) return 'Mexican';
    if (
      types.includes('fast_food_restaurant') ||
      types.includes('burger_restaurant') ||
      types.includes('pizza_restaurant')
    )
      return 'Fast Food';
    if (types.includes('bakery')) return 'Bakery';
    if (types.includes('cafe') || types.includes('coffee_shop')) return 'Cafe';
    if (
      types.includes('veg_restaurant') ||
      types.includes('vegetarian_restaurant')
    )
      return 'Pure Veg';

    if (
      name.includes('dosa') ||
      name.includes('idli') ||
      name.includes('sagar') ||
      name.includes('udupi') ||
      name.includes('tiffins')
    )
      return 'South Indian';
    if (
      name.includes('tandoor') ||
      name.includes('roti') ||
      name.includes('kabab') ||
      name.includes('dhaba') ||
      name.includes('punjabi') ||
      name.includes('paratha')
    )
      return 'North Indian';
    if (name.includes('indian') || name.includes('curry')) return 'Indian';
    if (
      name.includes('chinese') ||
      name.includes('noodle') ||
      name.includes('wok')
    )
      return 'Chinese';
    if (
      name.includes('pizza') ||
      name.includes('pasta') ||
      name.includes('italian')
    )
      return 'Italian';
    if (name.includes('burger') || name.includes('fries')) return 'Fast Food';
    if (
      name.includes('bakery') ||
      name.includes('cake') ||
      name.includes('sweet')
    )
      return 'Bakery';
    if (name.includes('cafe') || name.includes('coffee')) return 'Cafe';

    const generic = types.find(
      (t) =>
        t !== 'restaurant' &&
        t !== 'food' &&
        t !== 'point_of_interest' &&
        t !== 'establishment'
    );
    if (generic)
      return generic
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return 'Multi-cuisine';
  },

  deriveMealType(place) {
    const types = place.types || [];
    const mealTypes = new Set();

    if (place.servesBreakfast) mealTypes.add('breakfast');
    if (place.servesLunch) mealTypes.add('lunch');
    if (place.servesDinner) mealTypes.add('dinner');
    if (types.includes('bakery') || types.includes('cafe')) {
      mealTypes.add('snacks');
    }
    if (types.includes('fast_food_restaurant')) {
      mealTypes.add('snacks');
      mealTypes.add('lunch');
      mealTypes.add('dinner');
    }

    if (place.regularOpeningHours && place.regularOpeningHours.periods) {
      const period = place.regularOpeningHours.periods[0];
      if (period && period.open) {
        const hour = period.open.hour;
        if (hour < 10) mealTypes.add('breakfast');
      }
    }

    if (mealTypes.size === 0) {
      mealTypes.add('lunch');
      mealTypes.add('dinner');
    }

    return Array.from(mealTypes);
  },

  getConciseAddress(place) {
    if (place.addressComponents) {
      let sublocality = '';

      for (const component of place.addressComponents) {
        if (
          component.types.includes('sublocality_level_1') ||
          component.types.includes('sublocality')
        ) {
          sublocality = component.longText;
        }
      }
      if (sublocality) return sublocality;
    }

    if (place.formattedAddress) {
      const parts = place.formattedAddress.split(',').map((p) => p.trim());
      const cityIndex = parts.findIndex((p) => p.includes('Bengaluru'));
      if (cityIndex > 0) {
        return parts[cityIndex - 1];
      }
      if (parts.length >= 4) {
        return parts[parts.length - 4];
      }
    }

    return 'Bengaluru';
  },

  transformData(places) {
    return places.map((place) => {
      const photoUrl =
        place.photos && place.photos.length > 0
          ? this.getPhotoUrl(place.photos[0].name)
          : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop';

      let price = 300;
      let priceString = '₹300';

      switch (place.priceLevel) {
        case 'PRICE_LEVEL_INEXPENSIVE':
          price = 150;
          priceString = '₹150';
          break;
        case 'PRICE_LEVEL_MODERATE':
          price = 350;
          priceString = '₹350';
          break;
        case 'PRICE_LEVEL_EXPENSIVE':
          price = 600;
          priceString = '₹600';
          break;
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
          price = 1000;
          priceString = '₹1000';
          break;
      }

      const cuisine = this.deriveCuisine(place);
      const mealType = this.deriveMealType(place);

      return {
        id: place.name || Math.random().toString(36).substr(2, 9),
        name: place.displayName?.text || 'Unknown Restaurant',
        cuisine: cuisine,
        price: price,
        priceString: priceString,
        rating: place.rating || 0,
        reviews: place.userRatingCount || 0,
        mealType: mealType,
        image: photoUrl,
        description:
          place.editorialSummary?.text || 'No description available.',
        location: this.getConciseAddress(place),
        specialty: 'Variety of dishes',
        lat: place.location?.latitude,
        lng: place.location?.longitude,
        phoneNumber: place.nationalPhoneNumber,
        website: place.websiteUri,
        isOpen: place.currentOpeningHours?.openNow,
        openStatusText: place.currentOpeningHours?.openNow
          ? 'Open Now'
          : 'Closed',
      };
    });
  },
};
