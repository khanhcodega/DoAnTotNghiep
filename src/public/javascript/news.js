$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        items: 6, // Number of items to display
        loop: true,
        // nav: true,
        margin: 6,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        onTranslated: function (event) {
            // Get the index of the current item
            var currentIndex = event.item.index - event.relatedTarget._clones.length / 2 - 1;
            if (currentIndex >= event.item.count) {
                currentIndex = currentIndex % event.item.count;
            }
            var currentSrc = $(".owl-item").eq(currentIndex).find("img").attr("src");
            $("#main-image").attr("src", currentSrc);
        }
    });

    // Change main image on click
    $(".carousel-image").on("click", function () {
        var src = $(this).attr("src");
        $("#main-image").attr("src", src);
    });

    // Change main image on hover
    $(".carousel-image").on("mouseenter", function () {
        var src = $(this).attr("src");
        $("#main-image").attr("src", src);
    });

    const userContent = document.querySelector(".user-content");
    const userPost = document.querySelector(".user-post");
    const headerHeight = document.querySelector("header").offsetHeight; // Lấy chiều cao của header

    function updateUserContentPosition() {
        const userPostRect = userPost.getBoundingClientRect();
        const userContentHeight = userContent.offsetHeight;
        const windowHeight = window.innerHeight;
        const distanceFromBottom = 20; // Khoảng cách từ cạnh dưới của màn hình

        if (userPostRect.top < headerHeight + 20 && userPostRect.bottom > userContentHeight + headerHeight + 20) {
            userContent.style.top = `${headerHeight + 20}px`;
        } else if (userPostRect.bottom <= userContentHeight + headerHeight + 20) {
            userContent.style.top = `${userPostRect.bottom - userContentHeight - distanceFromBottom}px`;
        } else {
            userContent.style.top = `${userPostRect.top}px`;
        }
    }

    if (userPost) {

        window.addEventListener("scroll", updateUserContentPosition);
        window.addEventListener("resize", updateUserContentPosition);
        updateUserContentPosition(); // Cập nhật vị trí khi trang được tải
    }

    $('.btn-preview').click(function(event){
        const $itemContent = $(this).closest('.item-content');
        const idNews = $itemContent.data('news');
        fetch('/nha-cho-thue/api/history-news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // ma_so_nguoi_dung: 1, // Thay bằng mã số người dùng hiện tại
                ma_so: idNews // Mã số bài viết lấy từ data của thẻ cha
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
               
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })

    $('.btn-like').click(function (event) {
        const $itemContent = $(this).closest('.item-content');
        const idNews = $itemContent.data('news');
        const isLiked = $itemContent.data('da-like');
        fetch('/nha-cho-thue/api/toggle-like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // ma_so_nguoi_dung: 1, // Thay bằng mã số người dùng hiện tại
                ma_so: idNews // Mã số bài viết lấy từ data của thẻ cha
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                if (isLiked) {
                    
                    $itemContent.data('da-like', 0);
                    $(this).html('<i class="fa-regular fa-heart"></i>');
                } else {
                   
                    $itemContent.data('da-like', 1);
                    $(this).html('<i class="fa-solid fa-heart"></i>');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    })
})