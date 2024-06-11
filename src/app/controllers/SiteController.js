const connection = require('../../config/db/index')

class SiteController {
    index(req, res, next) {
        const page = req.query.page || 1; // Trang mặc định là 1, bạn có thể truyền trang thông qua query params
        const user = req.session.ma_so || '';
        // console.log(user)
        const limit = 8; // Số bản ghi mỗi trang
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
                                res.render('home', { data, diaLyData: diaLyResults, chuyenmucData: chuyenmucResults });
                            }
                        );
                    }
                );
            }
        );
    }


    setMaSo(req, res, next) {
        const { ma_so } = req.body;
        req.session.ma_so = ma_so;
        res.json({ success: true, ma_so: req.session.ma_so });
    }
}

module.exports = new SiteController();
