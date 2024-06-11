const connection = require('../../config/db/index')

class PostNewsController {

    index(req, res, next) {
        res.render('postNews')
    }

    createPost(req, res, next) {


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

        } = req.body

        const images = req.files.images ? req.files.images.map(file => 'uploads/' + file.filename) : [];
        const video = req.files.video ? 'uploads/' + req.files.video[0].filename : null;

        const query = 'INSERT INTO wsrh.tin_tuc (ma_so_nguoi_dung, tieu_de, noi_dung, ma_chuc_nang, ma_phuong_xa, gia_tien, dien_tich, ngay_them, ngay_xoa, ngay_cap_nhat, noi_dung_them, dia_chi_cu_the, danh_sach_anh, ma_thanh_pho, ma_quan_huyen, video) VALUES(?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, null, null, ?, ?, ?, ?, ?, ?)';



        const values = [ma_so, titleNews, descNews, categorytype, ward, price, area, JSON.stringify({ interior, floor, bedroom, toilet, deposit }), fulladdress, JSON.stringify(images), city, district, video]

        console.log(values)
        connection.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
            }

            res.status(201).json({ statusReq: 201, successMessage: 'Tạo bài thành công thành công' });

        }
        );
    }

    getCity(req, res, next) {
        connection.query('SELECT * FROM thanh_pho', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            // console.log(results)
            res.json(results);
        });
    }

    getDistricts(req, res, next) {
        const ma_so_thanh_pho = req.query.ma_so_thanh_pho;
        connection.query('SELECT * FROM quan_huyen WHERE ma_so_thanh_pho = ?', [ma_so_thanh_pho], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            // console.log(results)
            res.json(results);
        });
    }

    getWards(req, res, next) {
        const ma_quan_huyen = req.query.ma_quan_huyen;
        connection.query('SELECT * FROM phuong_xa WHERE ma_quan_huyen = ?', [ma_quan_huyen], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }

    getCategoryType(req, res, next) {

        connection.query('SELECT * FROM chuyen_muc_tin', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
}

module.exports = new PostNewsController()