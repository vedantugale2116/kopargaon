import { initialSchedules } from '../src/lib/mockData.ts';
import { isRouteMatchingSearch } from '../src/lib/routeSearchHelper.ts';

console.log('===============================================================');
console.log('TESTING KOPARGAON EXPANDED ROUTE SEARCH & DIRECTIONALITY');
console.log('===============================================================');

const testCases = [
  { from: 'Kopargaon', to: 'Shirdi', shouldMatch: true },
  { from: 'Kopargaon', to: 'Nashik', shouldMatch: true },
  { from: 'Kopargaon', to: 'Ahmednagar', shouldMatch: true },
  { from: 'Kopargaon', to: 'Sangamner', shouldMatch: true },
  { from: 'Kopargaon', to: 'Manmad', shouldMatch: true },
  { from: 'Kopargaon', to: 'Yeola', shouldMatch: true },
  { from: 'Kopargaon', to: 'Rahata', shouldMatch: true }, // Intermediate stop
  { from: 'Kopargaon', to: 'Chhatrapati Sambhajinagar', shouldMatch: true },
  { from: 'Kopargaon', to: 'Aurangabad', shouldMatch: true },
  { from: 'Kopargaon', to: 'Pune', shouldMatch: true },
  { from: 'Kopargaon', to: 'Mumbai', shouldMatch: true },
  { from: 'Kopargaon', to: 'Dhule', shouldMatch: true },
  { from: 'Kopargaon', to: 'Jalgaon', shouldMatch: true },
  { from: 'Sangamner', to: 'Kopargaon', shouldMatch: true }, // Return route
  { from: 'Kopargaon', to: 'Chennai', shouldMatch: false }, // Invalid route
  { from: 'Jalgaon', to: 'Mumbai', shouldMatch: false } // Invalid route
];

let allPassed = true;

for (const tc of testCases) {
  const matches = initialSchedules.filter(s => isRouteMatchingSearch(s, tc.from, tc.to));
  const hasMatches = matches.length > 0;
  const pass = hasMatches === tc.shouldMatch;

  if (!pass) allPassed = false;

  console.log(
    `${pass ? '✅ PASS' : '❌ FAIL'}: Search "${tc.from}" → "${tc.to}" | Found: ${matches.length} matching bus(es) ${matches.map(m => `[${m.busNumber}: ${m.origin} -> ${m.destination}]`).join(', ')}`
  );
}

console.log('\n===============================================================');
console.log(allPassed ? '🎉 ALL ROUTE SEARCH & INTERMEDIATE STOP TESTS PASSED!' : '❌ SOME TESTS FAILED');
console.log('===============================================================');
