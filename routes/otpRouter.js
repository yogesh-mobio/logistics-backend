
const router = require('express').Router();



router.get('/otp', async (req, res) => {
    res.render('otp')
});
router.post('/otp', async (req, res) => {
    const otp = req.body
    
    res.render('transporterdetails',otp)
});


module.exports = router;