$(document).ready(function (index) {
    const citySelect = $('#city')
    const districtSelect = $('#district')
    const nameRoad = $('#nameroad')
    const homeNumber = $('#homenumber')
    const wardSelect = $('#ward')
    const fulladdress = $('#fulladdress')
    const categoryType = $('#categorytype')
    const listimageInput = $('#listimage');
    const imagePreview = $('.imagePreview');
    const videoPlayer = $('#videoPlayer')
    let images = [];
    let images1 = [];


    wardSelect.prop('disabled', true);
    districtSelect.prop('disabled', true);
    if (videoPlayer.attr('src') != '') {
        videoPlayer.css('display', 'block')
    } else {
        videoPlayer.css('display', 'none')

    }

    $('#video').change(function (e) {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            videoPlayer.attr('src', url)
            videoPlayer.css('display', 'block')
        }
    })

    $('.btn-delete').click(function (e) {
        e.preventDefault()
        $('#id01').addClass('open')
        const id = $(this).attr('href');
        const name = $(this).data('name');
        $('.modal-content').attr('action', `/quan-ly/quan-ly-tin/${id}/delete?_method=DELETE`);
        $('.modal-content  p').text(
            `Bạn có chắc chắn muốn xóa bài viết ${name} không ?`,
        );
    })

    $('.cancelbtn').click((e) => {
        $('#id01').removeClass('open')
    })

    listimageInput.change(() => {

        const files = listimageInput[0].files

        if (files.length > 0) {

            Array.from(files).forEach(file => {
                const isDuplicate = images.some(image => image.file.name === file.name && image.file.size === file.size);
                if (!isDuplicate) {

                    const reader = new FileReader();

                    reader.onload = function (event) {
                        const imgSrc = event.target.result;
                        images.push({ file: file, src: imgSrc });
                        displayAllImages()
                    }

                    reader.readAsDataURL(file)
                }
            })

        }
        listimageInput.val('');
    })


    function displayImages(images, targetArray) {
        imagePreview.html('');
        images.forEach((image, index) => {
            const imgContainer = $('<div>').addClass('image-container');
            const img = $('<img>').attr('src', image.src);
            const removeBtn = $('<button>').addClass('remove-btn').html('&times;').attr('data-index', index);

            removeBtn.on('click', function () {
                const index = $(this).attr('data-index');
                images.splice(index, 1);
                // Xóa ảnh khỏi mảng gốc
                if (targetArray === 'images') {
                    images1 = images1.filter((item) => item.src !== image.src);
                } else if (targetArray === 'images1') {
                    images = images.filter((item) => item.src !== image.src);
                }
                displayImages(images, targetArray);
            });

            imgContainer.append(img).append(removeBtn);
            imagePreview.append(imgContainer);
        });
    }


    function displayAllImages() {
        const allImages = [...images, ...images1];
        displayImages(allImages, 'images');
    }

    function updateFullAddress() {
        const city = citySelect.find('option:selected').text();
        const district = districtSelect.find('option:selected').text() || '';
        const ward = wardSelect.find('option:selected').text() || '';
        const road = nameRoad.val()
        const home = homeNumber.val()
        fulladdress.val(`${home},${road},${ward}, ${district}, ${city}`.replace(/^, |, , /, ''));
    }


    getCategoty()
    getCities()


    function getCategoty() {
        fetch('/dang-tin/api/categorytypes')
            .then(response => response.json())
            .then(data => {
                data.forEach(city => {
                    const optionSelect = document.createElement('option')
                    optionSelect.value = city.ma_so
                    optionSelect.textContent = city.ten_chuyen_muc
                    categoryType.append(optionSelect)
                });
                $('#categorytype').val($('#categorytype').attr('value'))
            })
    }


    function getCities() {
        fetch('/dang-tin/api/cities')
            .then(response => response.json())
            .then(data => {
                data.forEach(city => {
                    const optionSelect = document.createElement('option')
                    optionSelect.value = city.ma_so
                    optionSelect.textContent = city.ten_thanh_pho
                    citySelect.append(optionSelect)
                });
                $('#city').val($('#city').attr('value'))
                setValueform()
            })
    }

    citySelect.change((e) => {
        const cityCode = e.target.value
        console.log(cityCode)
        districtSelect.html('<option value="">Chọn quận/huyện</option>');
        wardSelect.html('<option value="">Chọn phường/xã</option>');

        wardSelect.prop('disabled', true);
        if (cityCode) {
            getDistricts(cityCode)

        } else {
            districtSelect.prop('disabled', true);

        }
        // updateFullAddress()
    })

    districtSelect.change((e) => {
        const districtCode = e.target.value
        wardSelect.html('<option value="">Chọn phường/xã</option>');
        wardSelect.prop('disabled', true);
        if (districtCode) {
            getWard(districtCode)
        } else {
            wardSelect.prop('disabled', true);
        }
        // updateFullAddress()
    })
    //postNews
    Validator({
        form: '.form-createPost',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#categorytype', 'Vui lòng chọn chuyên mục'),
            Validator.isRequired('#city', 'Vui lòng chọn Tỉnh/Thành phố'),
            Validator.isRequired('#district', 'Vui lòng chọn thành Quận/Huyện'),
            Validator.isRequired('#ward', 'Vui lòng chọn Phường/Xã'),
            Validator.isRequired('#nameroad', 'Vui lòng nhập tên đường'),
            Validator.isRequired('#area', 'Vui lòng nhập diện tích'),
            Validator.isRequired('#price', 'Vui lòng nhập giá thuê'),
            Validator.isRequired('#titleNews', 'Vui lòng nhập tiêu đề tin '),
            Validator.isRequired('#descNews', 'Vui lòng nhập nội dung tin '),
        ],
        onSubmit: () => {
            const { ma_so } = JSON.parse(localStorage.getItem('user'));

            $('#fulladdress').prop('disabled', false);
            const formData = new FormData($('.form-createPost')[0]);
            formData.append('ma_so', ma_so);


            images.forEach(image => formData.append('images', image.file));

            fetch('/dang-tin/api/create-post',
                {
                    method: 'POST',
                    // body: JSON.stringify(formData)
                    body: formData
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data) {

                        document.querySelector('.form-createPost').reset();
                        videoPlayer.css('display', 'none')

                        $('.imagePreview').empty();
                    }
                })
                .catch(error => console.error('Error loading modal:', error));

        }
    })

    //update News
    Validator({
        form: '.form-updateNews',
        errorSelector: '.form-message',
        rules: [
            Validator.isRequired('#categorytype', 'Vui lòng chọn chuyên mục'),
            Validator.isRequired('#city', 'Vui lòng chọn Tỉnh/Thành phố'),
            Validator.isRequired('#district', 'Vui lòng chọn thành Quận/Huyện'),
            Validator.isRequired('#ward', 'Vui lòng chọn Phường/Xã'),
            Validator.isRequired('#nameroad', 'Vui lòng nhập tên đường'),
            Validator.isRequired('#area', 'Vui lòng nhập diện tích'),
            Validator.isRequired('#price', 'Vui lòng nhập giá thuê'),
            Validator.isRequired('#titleNews', 'Vui lòng nhập tiêu đề tin '),
            Validator.isRequired('#descNews', 'Vui lòng nhập nội dung tin '),
        ],
        onSubmit: () => {

            $('#fulladdress').prop('disabled', false);
            const formData = new FormData($('.form-updateNews')[0]);


            images.forEach(image => formData.append('images', image.file));
            const id = $('.form-updateNews').data('id')
            formData.append('ma_so', id);

            const imageNew = images1.map(data => {
                const src = data.src
                const newSrc = src.substring(1)
                return newSrc
            })

            const oldVideo = $('#video').data('video')
            formData.append('old_video', oldVideo);
            formData.append('old_image', JSON.stringify(imageNew));
            fetch(`/quan-ly/quan-ly-tin/${id}/edit?method=PUT`,
                {
                    method: 'PUT',
                    // body: JSON.stringify(formData)
                    body: formData
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data) {

                        // document.querySelector('.form-createPost').reset();


                        // $('.imagePreview').empty();
                    }
                })
                .catch(error => console.error('Error loading modal:', error));

        }
    })
    wardSelect.on('change', updateFullAddress);
    homeNumber.on('change', updateFullAddress);
    nameRoad.on('change', updateFullAddress);




    function getDistricts(city) {

        fetch(`/dang-tin/api/districts?ma_so_thanh_pho=${city}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(district => {
                    const optionSelect = document.createElement('option')
                    optionSelect.value = district.ma_so
                    optionSelect.textContent = district.ten_quan_huyen
                    districtSelect.append(optionSelect)
                });
                $('#district').val($('#district').attr('value'))
                districtSelect.prop('disabled', false);
                const districtVal = $('#district').val()
                // console.log(districtVal);
                if (districtVal) {
                    getWard(districtVal)
                }
            })
    }

    function getWard(district) {

        fetch(`/dang-tin/api/wards?ma_quan_huyen=${district}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(ward => {
                    const optionSelect = document.createElement('option')
                    optionSelect.value = ward.ma_so
                    optionSelect.textContent = ward.ten_phuong_xa
                    wardSelect.append(optionSelect)
                });
                $('#ward').val($('#ward').attr('value'))
                wardSelect.prop('disabled', false);
            })
    }

    function setValueform() {

        const imagesData = $('#listimage').data('img')
        if (imagesData) {
            const imagesFromDatabase = Array.isArray(imagesData) ? imagesData : [imagesData];
            images1 = imagesFromDatabase.map(imageSrc => ({ src: '/' + imageSrc }));
            displayAllImages()
        }

        const selectFields = ['#categorytype', '#city', '#district', '#ward', '#interior', '#descNews'];

        selectFields.forEach(field => {
            $(field).val($(field).attr('value'));
        });
        if ($('#fulladdress').val()) {

            const arrayAddress = $('#fulladdress').val().split(',')
            $('#homenumber').val(arrayAddress[0])
            $('#nameroad').val(arrayAddress[1])
        }

        const cityVal = $('#city').val()
        if (cityVal) {
            getDistricts(cityVal)

        }

    }

})