// search.js

// 카카오맵 초기화
var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(36.3504, 127.3845), // 대전 중심좌표 예시
    level: 5
};
var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커 배열
var markers = [];

// JSON 파일에서 데이터 불러오기
function loadMarkers() {
    fetch('data.json') // JSON 파일 경로 수정
        .then(response => response.json())
        .then(data => {
            // 기존 마커 제거
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            data.documents.forEach(place => {
                var lat = parseFloat(place.y);
                var lng = parseFloat(place.x);
                var position = new kakao.maps.LatLng(lat, lng);

                // 마커 생성
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: position
                });

                // 인포윈도우 내용
                var infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:13px;">
                                <strong>${place.place_name}</strong><br>
                                <a href="${place.place_url}" target="_blank">상세보기</a>
                              </div>`
                });

                // 클릭 시 인포윈도우 열기
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });

                markers.push(marker);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// 페이지 로딩 시 실행
loadMarkers();
