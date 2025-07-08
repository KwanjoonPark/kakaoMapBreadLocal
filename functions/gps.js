function updateUserLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const userLatLng = new kakao.maps.LatLng(lat, lng);

    catMarker.setPosition(userLatLng);
    map.setCenter(userLatLng); // 지도 중심 이동
}

function handleLocationError(error) {
    console.error("위치 정보를 가져올 수 없습니다:", error);
}

function resetToUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateUserLocation, handleLocationError, {
            enableHighAccuracy: false,
            maximumAge: 0
        });
    } else {
        alert("GPS를 지원하지 않는 브라우저입니다.");
    }
}
