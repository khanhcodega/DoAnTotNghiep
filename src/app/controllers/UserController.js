const connection = require('../../config/db/index')

class UserController {
    index(req, res, next) {
        const ma_so = req.session.ma_so;
<<<<<<< HEAD
=======
        console.log(ma_so)
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
        connection.query(
            'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results[0];
<<<<<<< HEAD
=======
                // console.log(data);
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
                res.render('user', { data });
            }
        );
    }

<<<<<<< HEAD
    storeNews(req, res, next) {
        const ma_so = req.session.ma_so;
        connection.query(
            'SELECT * FROM tin_tuc WHERE `ma_so_nguoi_dung` = ? AND `ngay_xoa` IS NULL',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results.map(item => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const firstImage = images.length > 0 ? images[0] : null;
                    const formattedPrice = item.gia_tien.toLocaleString('vi-VN');


                    return {
                        ...item, firstImage, formattedPrice
                    };
                });


                res.render('userStoreNews', { data });
            }
        );
    }

    historyNews(req, res, next) {
        const page = req.query.page || 1; // Trang mặc định là 1, bạn có thể truyền trang thông qua query params

        const ma_so = req.session.ma_so;
        const limit = 10; // Số bản ghi mỗi trang
        const offset = (page - 1) * limit;
        connection.query(
            'SELECT lst.*, tt.danh_sach_anh ,tt.tieu_de,tt.dien_tich,tt.gia_tien,tt.noi_dung_them,DATE_FORMAT(tt.ngay_them , \'%d/%m/%Y\') AS ngay_tao, nd.ten_nguoi_dung, qh.ten_quan_huyen  FROM lich_su_xem_tin lst JOIN tin_tuc tt  ON lst.ma_so_tin_tuc = tt.ma_so JOIN nguoi_dung nd ON tt.ma_so_nguoi_dung = nd.ma_so JOIN quan_huyen qh  ON tt.ma_quan_huyen = qh.ma_so  WHERE lst.ma_so_nguoi_dung = ? LIMIT ?,?',
            [ma_so, offset, limit],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }

                const data = results.map(item => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const formattedPrice = item.gia_tien / 1000000
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const { interior, floor, bedroom, toilet, deposit } = noiDungThem;
                    return {
                        ...item, images, formattedPrice, interior, floor, bedroom,
                        toilet,
                        deposit
                    };
                });

                res.render('historyNews', { data });
            }
        );
    }

    saveNews(req, res, next) {
        const page = req.query.page || 1; // Trang mặc định là 1, bạn có thể truyền trang thông qua query params

        const ma_so = req.session.ma_so;
        const limit = 10; // Số bản ghi mỗi trang
        const offset = (page - 1) * limit;
        connection.query(
            'SELECT yt.*, tt.danh_sach_anh ,tt.tieu_de,tt.dien_tich,tt.gia_tien,tt.noi_dung_them,DATE_FORMAT(tt.ngay_them , \'%d/%m/%Y\') AS ngay_tao, nd.ten_nguoi_dung, qh.ten_quan_huyen,CASE WHEN yt.ma_so_nguoi_dung IS NOT NULL THEN 1 ELSE 0 END AS da_like  FROM yeu_thich yt JOIN tin_tuc tt  ON yt.ma_so_tin_tuc = tt.ma_so JOIN nguoi_dung nd ON tt.ma_so_nguoi_dung = nd.ma_so JOIN quan_huyen qh  ON tt.ma_quan_huyen = qh.ma_so  WHERE yt.ma_so_nguoi_dung = ? LIMIT ?,?',
            [ma_so, offset, limit],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }

                const data = results.map(item => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const formattedPrice = item.gia_tien / 1000000
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const { interior, floor, bedroom, toilet, deposit } = noiDungThem;
                    return {
                        ...item, images, formattedPrice, interior, floor, bedroom,
                        toilet,
                        deposit
                    };
                });

                res.render('saveNews', { data });
            }
        );
    }
    getInfoNews(req, res, next) {
        const ma_so = req.params.id;
        connection.query(
            'SELECT * FROM tin_tuc WHERE `ma_so` = ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }

                const data = results[0]
                const images = data.danh_sach_anh ? JSON.parse(data.danh_sach_anh).reverse() : [];
                const moreInfo = data.noi_dung_them ? JSON.parse(data.noi_dung_them) : {};
                // console.log(images, data)
                res.render('updateNews', { data, images, moreInfo })

            }
        );
    }

    // previewNews(req, res, next) {
    //     res.render('postNews')
    // }

    updateNews(req, res, next) {


        const {
            ma_so,
            categorytype,
            city,
            district,
            ward,
            fulladdress,
            interior,
            floor,
            bedroom,
            toilet,
            area,
            price,
            deposit,
            titleNews,
            descNews,
            old_image,
            old_video
        } = req.body

        const images = req.files.images ? req.files.images.map(file => 'uploads/' + file.filename) : [];
        const video = req.files.video ? 'uploads/' + req.files.video[0].filename : old_video;

        const query = 'UPDATE wsrh.tin_tuc SET  `tieu_de`=?, `noi_dung`=?, `ma_chuc_nang`=?, `ma_phuong_xa`=?, `gia_tien`=?, `dien_tich`=?,   `ngay_cap_nhat`=CURRENT_TIMESTAMP, `noi_dung_them`=?, `dia_chi_cu_the`=?, `danh_sach_anh`=?, `ma_thanh_pho`=?, `ma_quan_huyen`=? ,`video`=? WHERE `ma_so` = ?'


        const values = [titleNews, descNews, categorytype, ward, price, area, JSON.stringify({ interior, floor, bedroom, toilet, deposit }), fulladdress, JSON.stringify([...images, ...JSON.parse(old_image)]), city, district, video, ma_so]

        console.log(values)
        connection.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
            }

            res.status(201).json({ statusReq: 201, successMessage: 'Tạo bài thành công thành công' });

        }
        );
    }


    deleteNews(req, res, next) {
        const ma_so = req.params.id;
        console.log(ma_so)
        connection.query(
            'DELETE FROM wsrh.tin_tuc WHERE ma_so= ?',
            [ma_so],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }

                res.redirect('/quan-ly/quan-ly-tin');
            }
        );
    }



=======
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
    update(req, res, next) {
        const ma_so = req.session.ma_so;
        const { fullname, email, phonenumber, gender, birthday, address, old_avatar } = req.body
        const avatar = req.file ? 'uploads/' + req.file.filename : req.body.avatar

        console.log(req.body);
        console.log(req.file);

        const query = 'UPDATE nguoi_dung SET `ten_nguoi_dung` = ?, `email` = ?, `so_dien_thoai` = ?, `dia_chi` = ?, `gioi_tinh` = ?, `ngay_cap_nhat` = CURRENT_TIMESTAMP, `anh_dai_dien` = ?, `nam_sinh` = ? WHERE `ma_so` = ?'
        const values = [fullname, email, phonenumber ? phonenumber : null, address, gender, avatar ? avatar : old_avatar, birthday, ma_so]
        console.log(values)
        connection.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
            }

            // res.status(201).json({ statusReq: 201, successMessage: 'Cập nhật tài khoản thành công' });
            connection.query(
                'SELECT * FROM nguoi_dung nd WHERE `ma_so` = ?',
                [ma_so],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                    }
                    res.send(JSON.stringify(results[0]));
                }
            );
        }
        );
    }

<<<<<<< HEAD

=======
    setMaSo(req, res, next) {
        const { ma_so } = req.body;
        req.session.ma_so = ma_so;
        res.redirect('/quan-ly');
    }
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
}

module.exports = new UserController();