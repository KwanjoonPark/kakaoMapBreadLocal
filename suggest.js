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
    const categoryFilters = document.querySelector('.category-filters');
    suggestionsBox.innerHTML = '';

    if (input.length === 0) {
        suggestionsBox.style.display = 'none';
        categoryFilters.style.display = 'block'; // 입력이 없으면 필터 다시 표시
        return;
    }

    const matched = bakeryData
        .filter(place => place.place_name.includes(input))
        .slice(0, 5);

    if (matched.length === 0) {
        suggestionsBox.style.display = 'none';
        categoryFilters.style.display = 'block'; // 추천어 없으면 필터 다시 표시
        return;
    }

    // 추천어 있을 때는 필터 숨김
    categoryFilters.style.display = 'none';
    matched.forEach(place => {
        const div = document.createElement('div');
        div.style.padding = '5px 10px';
        div.style.cursor = 'pointer';
        div.textContent = place.place_name;
        div.addEventListener('click', function() {
            document.getElementById('keyword').value = place.place_name;
            suggestionsBox.style.display = 'none';
            categoryFilters.style.display = 'block'; // 추천어 클릭 후 필터 다시 표시
            searchPlaces();
        });
        suggestionsBox.appendChild(div);
    });

    const rect = e.target.getBoundingClientRect();
    suggestionsBox.style.left = rect.left + 'px';
    suggestionsBox.style.top = (rect.bottom + window.scrollY) + 'px';
    suggestionsBox.style.width = rect.width + 'px';
    suggestionsBox.style.display = 'block';
});

