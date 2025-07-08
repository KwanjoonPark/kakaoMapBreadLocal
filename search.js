var infowindow = new kakao.maps.InfoWindow(); // 전역으로 하나만 생성

async function searchPlaces() {
    var keyword = document.getElementById('keyword').value.trim();
    if (!keyword) {
        alert('검색어를 입력해주세요!');
        return;
    }

    savedCenter = map.getCenter();
    savedLevel = map.getLevel();

    // 추천어 상자 닫기
    const suggestionsBox = document.getElementById('suggestions');
    const categoryFilters = document.querySelector('.category-filters');
    suggestionsBox.style.display = 'none';
    categoryFilters.style.display = 'block'; // 필터 다시 표시

    try {
        const response = await fetch('bakery_data_enriched.json'); // 로컬 JSON 파일
        const json = await response.json();
        const data = json.documents;

        var matchedPlaces = data.filter(place =>
            place.place_name.includes(keyword)
        );

        clearMarkers();

        if (matchedPlaces.length === 0) {
            alert('검색된 장소 중 대전의 빵집이 없습니다.');
            restorePreviousMapView();
            return;
        }

        var bounds = new kakao.maps.LatLngBounds();
        matchedPlaces.forEach(place => {
            var position = new kakao.maps.LatLng(place.y, place.x);
            addMarker(position, place);
            bounds.extend(position);
        });

        map.setBounds(bounds);
        const center = map.getCenter();
        const newCenter = new kakao.maps.LatLng(center.getLat() + 0.001, center.getLng());
        map.setCenter(newCenter);

    } catch (error) {
        console.error('JSON 로드 실패:', error);
        alert('데이터를 불러오는 데 실패했습니다.');
        restorePreviousMapView();
    }
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(position, place) {
    var marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    markers.push(marker);

    kakao.maps.event.addListener(marker, 'click', function() {
        showPlaceInfo(marker, place);
    });
}

function restorePreviousMapView() {
    map.setCenter(savedCenter);
    map.setLevel(savedLevel);
}

function showPlaceInfo(marker, place) {
    const breads = place.menu?.map(m => m.name).join(', ') || '등록된 메뉴 없음';
    const opening = place.opening_hours?.map(o => `${o.day}: ${o.time}`).join('<br/>') || '운영시간 정보 없음';

    const content = `
        <div style="padding:10px;min-width:250px;">
            <strong>${place.place_name}</strong><br/>
            주소: ${place.road_address_name || place.address_name}<br/>
            전화: ${place.phone || '없음'}<br/>
            <a href="${place.place_url}" target="_blank">상세보기</a>
        </div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
}
