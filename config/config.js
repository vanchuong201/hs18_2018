module.exports = {
    email: {
        host: process.env.EMAIL_HOST || 'mail.icheck.vn',
        port: process.env.EMAIL_PORT || 25,
        user: process.env.EMAIL_USER || 'xacthuc@icheck.vn',
        pass: process.env.EMAIL_PASS || 'icheck@xacthuc'
    },
    userType : {
        superadmin: 1
    }
};

