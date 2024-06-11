const connection = require('../../config/db/index')

class RentalController {
    index(req, res, next) {
        const page = req.query.page || 1; // Trang mặc định là 1, bạn có thể truyền trang thông qua query params
        const user = req.session.ma_so || '';
        // console.log(user)
        const limit = 10; // Số bản ghi mỗi trang
        const offset = (page - 1) * limit;
        connection.query(
            'SELECT tin_tuc.*,nguoi_dung.anh_dai_dien,nguoi_dung.so_dien_thoai,nguoi_dung.ten_nguoi_dung,tp.ten_thanh_pho,qh.ten_quan_huyen, CASE WHEN yeu_thich.ma_so_nguoi_dung IS NOT NULL THEN 1 ELSE 0 END AS da_like, IFNULL(like_counts.total_likes, 0) AS tong_so_likes,DATE_FORMAT(tin_tuc.ngay_them , \'%d/%m/%Y\') AS ngay_tao FROM  tin_tuc JOIN  nguoi_dung ON tin_tuc.ma_so_nguoi_dung = nguoi_dung.ma_so LEFT JOIN thanh_pho tp ON tin_tuc.ma_thanh_pho = tp.ma_so LEFT JOIN quan_huyen qh  ON tin_tuc.ma_quan_huyen = qh.ma_so  LEFT JOIN  yeu_thich ON tin_tuc.ma_so = yeu_thich.ma_so_tin_tuc AND yeu_thich.ma_so_nguoi_dung = ? LEFT JOIN (SELECT ma_so_tin_tuc, COUNT(*) AS total_likes FROM yeu_thich GROUP BY ma_so_tin_tuc) AS like_counts ON tin_tuc.ma_so = like_counts.ma_so_tin_tuc WHERE  tin_tuc.ngay_xoa IS NULL LIMIT ?, ?', [user, offset, limit],

            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results.map(item => {
                    const images = JSON.parse(item.danh_sach_anh);
                    const firstFourImages = images.slice(0, 4);
                    const formattedPrice = item.gia_tien / 1000000
                    const noiDungThem = JSON.parse(item.noi_dung_them);
                    const noi_dung = item.noi_dung.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
                    const { interior, floor, bedroom, toilet, deposit } = noiDungThem;
                    return {
                        ...item, firstFourImages, formattedPrice, interior, floor, bedroom,
                        toilet,
                        deposit, noi_dung
                    };
                });
                // console.log(data)

                connection.query(
                    'SELECT * FROM quan_huyen ORDER BY ten_quan_huyen ASC',
                    (err, diaLyResults) => {
                        if (err) {
                            return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                        }

                        connection.query(
                            'SELECT * FROM chuyen_muc_tin ',
                            (err, chuyenmucResults) => {
                                if (err) {
                                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                                }
                                // Pass thông tin từ bảng địa lý vào res.render
                                res.render('rental', { data, diaLyData: diaLyResults, chuyenmucData: chuyenmucResults });
                            }
                        );
                    }
                );
            }
        );
    }

    show(req, res, next) {
        const ma_so = req.params.id;
        const user = req.session.ma_so || '';
        connection.query(
            'SELECT tin_tuc.*,nguoi_dung.anh_dai_dien,nguoi_dung.so_dien_thoai,nguoi_dung.ten_nguoi_dung, CASE WHEN yeu_thich.ma_so_nguoi_dung IS NOT NULL THEN 1 ELSE 0 END AS da_like FROM  tin_tuc JOIN  nguoi_dung ON tin_tuc.ma_so_nguoi_dung = nguoi_dung.ma_so  LEFT JOIN  yeu_thich ON tin_tuc.ma_so = yeu_thich.ma_so_tin_tuc AND yeu_thich.ma_so_nguoi_dung = ? WHERE tin_tuc.ma_so =? and tin_tuc.ngay_xoa IS NULL ', [user, ma_so],

            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                const data = results[0]
                const images = JSON.parse(data.danh_sach_anh);
                const formattedPrice = data.gia_tien / 1000000
                const noiDungThem = JSON.parse(data.noi_dung_them);
                const noi_dung = data.noi_dung.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
                const sonha = data.dia_chi_cu_the.split(',')[0]

                const { ma_phuong_xa, ma_thanh_pho, ma_quan_huyen } = data


                connection.query(
                    'SELECT tp.ten_thanh_pho, qh.ten_quan_huyen,px.ten_phuong_xa FROM phuong_xa px JOIN quan_huyen qh ON px.ma_quan_huyen = qh.ma_so JOIN thanh_pho tp ON qh.ma_so_thanh_pho = tp.ma_so WHERE  px.ma_so = ? AND qh.ma_so = ? AND tp.ma_so = ? ', [ma_phuong_xa, ma_quan_huyen, ma_thanh_pho],

                    (err, diaLyResults) => {
                        if (err) {
                            return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                        }

                        connection.query(
                            'SELECT dg.ma_so, dg.diem_danh_gia, dg.ma_so_tin_tuc, dg.ma_so_nguoi_dung, dg.ngay_danh_gia, dg.binh_luan, nd.ten_nguoi_dung, nd.anh_dai_dien,DATE_FORMAT(dg.ngay_danh_gia , \'%d/%m/%Y\') AS ngay_tao  FROM wsrh.danh_gia dg JOIN wsrh.nguoi_dung nd ON dg.ma_so_nguoi_dung = nd.ma_so WHERE ma_so_tin_tuc = ? ORDER BY dg.ngay_danh_gia DESC ', [ma_so],
        
                            (err, feedbackResult) => {

                                if (err) {
                                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                                }
                                console.log(feedbackResult)
        
                                res.render('rentHouse', { images, data, formattedPrice, noiDungThem, noi_dung, diaLyData: diaLyResults[0], sonha ,feedbackResult});
        
                                
                            }
                        );
                    }
                );
            }
        );
    }

    toggleLike(req, res, next) {
        const { ma_so } = req.body;
        const user = req.session.ma_so || '';

        console.log(ma_so, user)
        connection.query(
            'SELECT * FROM yeu_thich WHERE ma_so_nguoi_dung = ? AND ma_so_tin_tuc = ?', [user, ma_so],

            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                if (results.length > 0) {
                    connection.query(
                        'DELETE FROM yeu_thich WHERE ma_so_nguoi_dung = ? AND ma_so_tin_tuc = ?', [user, ma_so],

                        (err, results) => {
                            if (err) {
                                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                            }
                            res.status(200).json({ message: "Đã hủy like." });
                        }
                    );
                } else {
                    connection.query(
                        'INSERT INTO yeu_thich (ma_so_nguoi_dung, ma_so_tin_tuc) VALUES (?, ?)', [user, ma_so],

                        (err, results) => {
                            if (err) {
                                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                            }
                            res.status(200).json({ message: "Đã like." });
                        }
                    );
                }
            }
        );
    }

    historyNews(req, res, next) {
        const { ma_so } = req.body;
        const user = req.session.ma_so || '';

        console.log(ma_so, user)
        connection.query(
            'SELECT * FROM lich_su_xem_tin WHERE ma_so_nguoi_dung = ? AND ma_so_tin_tuc = ?', [user, ma_so],

            (err, results) => {
                if (err) {
                    return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                }
                if (results.length > 0) {
                    console.log(results[0].ma_so)
                    connection.query(
                        'UPDATE wsrh.lich_su_xem_tin SET ma_so_nguoi_dung=?,ma_so_tin_tuc=?, ngay_xem=CURRENT_TIMESTAMP WHERE ma_so= ?', [user, ma_so, results[0].ma_so],

                        (err, results) => {
                            if (err) {
                                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                            }
                            res.status(200).json({ message: "Đã hủy like." });
                        }
                    );
                } else {
                    connection.query(
                        'INSERT INTO wsrh.lich_su_xem_tin (ma_so_nguoi_dung, ma_so_tin_tuc, ngay_xem) VALUES(?, ?, CURRENT_TIMESTAMP)', [user, ma_so],

                        (err, results) => {
                            if (err) {
                                return res.status(500).json({ errMessage: 'Server error', statusReq: 500 });
                            }
                            res.status(200).json({ message: "Đã like." });
                        }
                    );
                }
            }
        );
    }
}

module.exports = new RentalController()