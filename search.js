var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(36.37, 127.35), // KAIST
    level: 3
};
var map = new kakao.maps.Map(container, options);
var ps = new kakao.maps.services.Places();
var markers = [];

// 검색 전에 지도 상태를 저장할 변수
var savedCenter = map.getCenter();
var savedLevel = map.getLevel();

function searchPlaces() {
    var keyword = document.getElementById('keyword').value.trim();
    if (!keyword) {
        alert('검색어를 입력해주세요!');
        return;
    }

    // 검색 전 상태 저장
    savedCenter = map.getCenter();
    savedLevel = map.getLevel();

   var searchOption = {
      location: map.getCenter(),
      radius: 15000               
   };


    ps.keywordSearch(keyword, placesSearchCB, searchOption);
}


function placesSearchCB(data, status) {
    if (status !== kakao.maps.services.Status.OK) {
        handleSearchError(status);
        return;
    }

    var bounds = new kakao.maps.LatLngBounds();
    clearMarkers();

    for (var i = 0; i < data.length; i++) {
        var place = data[i];

        if (!place.category_name.includes('제과,베이커리')) continue;
        if (!place.address_name.includes('대전')) continue;

        var position = new kakao.maps.LatLng(place.y, place.x);
        addMarker(position);
        bounds.extend(position);
    }

    if (markers.length > 0) {
        map.setBounds(bounds);
    } else {
        alert('검색된 장소 중 제과,베이커리에 해당하는 결과가 없습니다.');
        restorePreviousMapView();
    }
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(position) {
    var marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    markers.push(marker);
}

function restorePreviousMapView() {
    map.setCenter(savedCenter);
    map.setLevel(savedLevel);
}

function handleSearchError(status) {
    if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 없습니다.');
    } else {
        alert('검색 중 오류가 발생했습니다.');
    }
    restorePreviousMapView();
}