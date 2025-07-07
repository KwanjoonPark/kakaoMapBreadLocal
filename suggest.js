let bakeryData = []; // 전역에 JSON 데이터를 담을 변수

// 초기화 시 JSON을 한 번만 불러와 메모리에 보관
async function loadBakeryData() {
    try {
        const response = await fetch('bakery_data_enriched.json');
        const json = await response.json();
        bakeryData = json.documents;
    } catch (error) {
        console.error("추천 데이터 로드 실패:", error);
    }
}

loadBakeryData();

// 검색창 입력 시 추천어 표시
document.getElementById('keyword').addEventListener('input', function(e) {
    const input = e.target.value.trim();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = '';

    if (input.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    const matched = bakeryData
        .filter(place => place.place_name.includes(input))
        .slice(0, 5); // 최대 5개 추천

    if (matched.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    matched.forEach(place => {
        const div = document.createElement('div');
        div.style.padding = '5px 10px';
        div.style.cursor = 'pointer';
        div.textContent = place.place_name;
        div.addEventListener('click', function() {
            document.getElementById('keyword').value = place.place_name;
            suggestionsBox.style.display = 'none';
            searchPlaces();
        });
        suggestionsBox.appendChild(div);
    });

    // 추천어 박스 위치 조정 (검색창 아래)
    const rect = e.target.getBoundingClientRect();
    suggestionsBox.style.left = rect.left + 'px';
    suggestionsBox.style.top = (rect.bottom + window.scrollY) + 'px';
    suggestionsBox.style.width = rect.width + 'px';
    suggestionsBox.style.display = 'block';
});
