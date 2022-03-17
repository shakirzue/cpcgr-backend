const dotenv = require('dotenv');

dotenv.config();
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GEOCODING_KEY,
    Promise: Promise
});

async function calculateCustomerAddressGeoCoordinates(address) {
    return new Promise(function (resolve, reject) {

        googleMapsClient.geocode({
            address: address
        }, function (err, response) {
            if (!err) {
                resolve({ Latitude: response.json.results[0]['geometry'].location.lat, Longitude: response.json.results[0]['geometry'].location.lng });                
            }           
        });
    });
}

// async function calculateCustomerAddressGeoCoordinates(address) {
//     return new Promise((resolve) => {
//         setTimeout(function () {
//             index = index + 1;
//             console.log(index);
//             googleMapsClient.geocode({
//                 address: address
//             }, function (err, response) {
//                 if (!err) {
//                     console.log(response.json.results[0]['geometry']);
                   
//                     resolve({ Latitude: response.json.results[0]['geometry'].location.lat, Longitude: response.json.results[0]['geometry'].location.lng });
//                 }
//             })
//         }, 2000);
//     }
//     );
// }
async function calculateDistanceByGeoCoordinates(lat1, lat2, long1, long2) {

    return new Promise(function (resolve, reject) {

        var R = 3958.8; // Radius of the Earth in miles
        var rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
        var rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon = (long2 - long1) * (Math.PI / 180); // Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));

        resolve(Math.round((d + Number.EPSILON) * 100) / 100);
    });

}

module.exports = {
    calculateCustomerAddressGeoCoordinates,
    calculateDistanceByGeoCoordinates
};