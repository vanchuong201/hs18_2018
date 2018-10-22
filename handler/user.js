const userModel = require('../models/user')
const Boom = require('boom')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config/env')

exports.register = async (body) => {
    let user = await userModel.getUserByUsername(body.username)
    if (user)
        throw Boom.notAcceptable('username already exists')

    if (body.password !== body.repassword)
        throw Boom.notAcceptable('password not match')

    body.password = crypto.createHash('sha256').update(body.password).digest('hex')
    delete body['repassword']
    return userModel.createUser(body)
}

exports.login = async (body) => {
    let user = await userModel.getUserByUsername(body.username)
    if (!user)
        throw Boom.notFound('user not exists')

    let hash_password = crypto.createHash('sha256').update(body.password).digest('hex')
    if (user.password != hash_password)
        throw Boom.notAcceptable('wrong password')

    let expiresTime = Date.now() / 1000 + 60 * 60 * 30
    let token = jwt.sign({
        exp: expiresTime,
        data: {
            id: user.id,
            username: user.username,
            // role: user.role
        }
    }, config.SECRET_KEY)

    return {
        id: user.id,
        username: user.username,
        // role: user.role || 0,
        token: token,
        expires: expiresTime
    }
}

exports.getList = async (options) => {
    return userModel.getList(options)
}

exports.profile = async (id) => {
    return userModel.getUserById(id)
}

exports.create = async (body) => {
    let checkExist = await userModel.getUserByUsername(body.username)
    if(checkExist)
        throw Boom.notAcceptable('username already exists')

    return userModel.createUser(body)
}