var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(36.37, 127.35), // KAIST
    level: 3
};
var map = new kakao.maps.Map(container, options);
var ps = new kakao.maps.services.Places();
var markers = [];
var savedCenter = map.getCenter();
var savedLevel = map.getLevel();

var catMarker = new kakao.maps.Marker({
    map: map,
    position: map.getCenter(), // 초기 위치
    image: new kakao.maps.MarkerImage(
        'icon/cat_brown.png',
        new kakao.maps.Size(50, 50),
        { offset: new kakao.maps.Point(15, 15) }
    )
});
