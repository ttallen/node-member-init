var express = require('express');
var router = express.Router();
var firebase = require('../connections/firebase_connect');
var firebaseDb = require('../connections/firebase_admin_connect');
var fireAuth = firebase.auth();
router.get('/', function (req, res) {
    res.render('signup', { title: '註冊',success: req.flash('success'),error: req.flash('error')});
})

router.post('/', function (req, res) {
    var email = req.body.email;
    var password = req.body.passwd;
    var nickname = req.body.nickname;
    var username = req.body.username;
    // Promise
    fireAuth.createUserWithEmailAndPassword(email, password)
    .then(function(user) {
        var saveUser = {
            'email': email,
            'nickname': nickname,
            'username': username,
            'uid': user.user.uid
        }
        firebaseDb.ref(`/user/${user.user.uid}`).set(saveUser);
        req.flash('success','註冊成功');
        res.redirect('/signup');
    })
    .catch(function(error) {
        var errorMessage = error.message;
        switch(errorMessage) {
            case 'The email address is badly formatted.':
                errorMessage = '電子郵件地址格式錯誤';
                break;
            case 'The email address is already in use by another account.':
                errorMessage = '該電子郵件地址已被另一個帳戶使用';
                break;
            case 'The password must be 6 characters long or more.':
            case 'Password should be at least 6 characters' :  
                errorMessage = '密碼長度至少為6個字符';
                break;  
        }
        req.flash('error',errorMessage);
        res.redirect('/signup');
    })
})

module.exports = router;