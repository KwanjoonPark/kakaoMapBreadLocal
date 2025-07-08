let currentCategory = null; // 현재 선택된 카테고리

function filterByCategory(categoryNumber, buttonElement) {
    const allButtons = document.querySelectorAll('.category-button');

    if (currentCategory === categoryNumber) {
        // 같은 버튼을 다시 클릭 → 전체 표시
        currentCategory = null;
        loadMarkers();

        // 모든 버튼 active 해제
        allButtons.forEach(btn => btn.classList.remove('active'));
    } else {
        currentCategory = categoryNumber;

        fetch('data/ID_categorized.json')
            .then(response => response.json())
            .then(categoryData => {
                const filteredIds = categoryData[categoryNumber];
                if (filteredIds) {
                    loadMarkers(filteredIds);

                    // 모든 버튼 active 해제 후 현재 버튼만 active 추가
                    allButtons.forEach(btn => btn.classList.remove('active'));
                    buttonElement.classList.add('active');
                } else {
                    console.error(`Category ${categoryNumber} not found.`);
                }
            })
            .catch(error => console.error('Error loading category data:', error));
    }
}
