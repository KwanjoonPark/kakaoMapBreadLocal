// 마커 배열
var markers = [];

// JSON 파일에서 데이터 불러오기
function loadMarkers() {
    fetch('bakery_data_processed.json') // JSON 파일 경로 수정
        .then(response => response.json())
        .then(data => {
            // 기존 마커 제거
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            data.documents.forEach(place => {
                var lat = parseFloat(place.y);
                var lng = parseFloat(place.x);
                var position = new kakao.maps.LatLng(lat, lng);
                var imageSrc = 'marker_bread.png', // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)};
                var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: position,
                    image : markerImage,
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
