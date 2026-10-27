// Business details, in one place so the client can update them without touching the pages.
// Source: the Google Business listing (Oct 2026) and the restaurant's own social pages.

export const site = {
  name: 'The Waffle Spot',
  formerName: 'Waffle & Co',
  owner: 'Erald and his team',
  street: '496 MC Roode Street',
  town: 'Potchefstroom',
  postcode: '2531',
  province: 'North West',
  phoneDisplay: '076 768 7654',
  phoneHref: 'tel:+27767687654',
  timezone: 'Africa/Johannesburg',
  // Same hours every day, from the Google listing.
  opens: { h: 9, m: 0 },
  closes: { h: 17, m: 0 },
  hoursLabel: '09:00–17:00',
  rating: 4.5,
  reviewCount: 960,
  geo: { lat: -26.6749798, lng: 27.1102563 },
  links: {
    instagram: 'https://www.instagram.com/the_waffle_spot_potchefstroom/',
    instagramHandle: '@the_waffle_spot_potchefstroom',
    facebook: 'https://www.facebook.com/waffle.potch/',
    facebookHandle: 'facebook.com/waffle.potch',
    google: 'https://share.google/bwIlwipTlnGiqEmGe',
    googleReviews:
      'https://www.google.com/maps/place/Waffle+Spot+Potchefstroom/@-26.6749798,27.1102563,17z/data=!4m8!3m7!1s0x1e968102125d8caf:0xbca005ee43318e31!8m2!3d-26.6749798!4d27.1102563!9m1!1b1',
    // The TripAdvisor listing still trades under the old name. Replace with the exact listing URL when known.
    tripadvisor: 'https://www.tripadvisor.co.za/Search?q=Waffle%20Co%20Potchefstroom',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Waffle+Spot+Potchefstroom%2C+496+M+C+Roode+St%2C+Potchefstroom%2C+2531',
    mapEmbed:
      'https://www.google.com/maps?q=Waffle+Spot+Potchefstroom,+496+M+C+Roode+St,+Potchefstroom,+2531&z=16&output=embed',
  },
} as const;

export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
