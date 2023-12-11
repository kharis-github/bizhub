// Controller untuk requests yang berhubungan dengan model Review.

// I | REQUIREMENTS
const Review = require('../models/review');
const Business = require('../models/business');
// II | CONTROLLERS

module.exports.add_review = async (req, res) => {
    // ambil id business dari URL
    const id = req.params.id;
    // 1 | instansiasi item review
    const review = new Review(req.body);
    // 2 | masukkan id user ke property review agar tersambung
    review.author = req.user._id;
    await review.save();
    // 3 | sambungkan data review ke data business, lalu simpan 
    const biz = await Business.findById(id);
    biz.reviews.push(review);
    await biz.save();
    // flash message dan redirect user
    req.flash('success', 'Komentar berhasil disubmit!');
    res.redirect(`/business/${id}`);
}

module.exports.delete_review = async (req, res) => {
    // 1 | Ambil id business dan review
    const { id, revId } = req.params;
    // 2 | Delete review dari collection reviews
    await Review.findByIdAndDelete(revId);
    // 3 | Delete review dari property reviews di business
    await Business.findByIdAndUpdate(id, { $pull: { reviews: revId } });
    // kirim flash message success dan redirect user
    req.flash('success', 'Komen berhasil dihapus.');
    res.redirect(`/business/${id}`);
}