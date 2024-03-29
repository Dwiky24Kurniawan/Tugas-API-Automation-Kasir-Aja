const request = require('supertest')
const { expect } = require('chai')
const baseUrl = 'https://kasir-api.belajarqa.com'
const userRegistration = require('../testData/userRegistration.json')
const userLogin = require('../testData/userLogin.json')
const addUser = require('../testData/addUser.json')
const addUnit = require('../testData/addUnit.json')
const addCategory = require('../testData/addCategory.json')
const addCustomer = require('../testData/addCustomer.json')
const updateUser = require('../testData/updateUser.json')
const updateUnit = require('../testData/updateUnit.json')
const updateCategory = require('../testData/updateCategory.json')
const updateCustomer = require('../testData/updateCustomer.json')

var token
var officeId
var userId
var unitId
var categoryId
var customerId
var productId
var saleId
var purchaseId

beforeEach(function (done) {
    request(baseUrl)
        .post('/authentications')
        .send(userLogin)
        .end(function (err, res) {
            token = res.body.data.accessToken
            if (err) {
                throw err
            }
            done()
        })
})

describe('Test Endpoint Registration /registration and Login /authentications', function () {
    //Endpoint /registration
    //Authorization - Registration
    it('Success create user registration', (done) => {
        request(baseUrl)
            .post('/registration')
            .send(userRegistration)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Toko berhasil didaftarkan')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(userRegistration.name)
                expect(await response.body.data.email).not.to.be.null
                expect(await response.body.data.email).to.be.equal(userRegistration.email)
                expect(await response.body.data.password).not.to.be.null
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Endpoint /authentications
    //Authorization - Login
    it('Success login using valid credential', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send(userLogin)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Authentication berhasil ditambahkan')
                expect(await response.body.data.accessToken).not.to.be.null
                expect(await response.body.data.refreshToken).not.to.be.null
                expect(await response.body.data.user.id).not.to.be.null
                expect(await response.body.data.user.name).not.to.be.null
                expect(await response.body.data.user.name).to.be.equal(userRegistration.name)
                expect(await response.body.data.user.role).not.to.be.null
                expect(await response.body.data.user.role).to.be.equal('admin')
                expect(await response.body.data.user.email).not.to.be.null
                expect(await response.body.data.user.email).to.be.equal(userRegistration.email)
                expect(await response.body.data.user.company_name).not.to.be.null
                expect(await response.body.data.user.company_name).to.be.equal(userRegistration.name)
                officeId = response.body.data.user.officeId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login using invalid credential', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send({
                "email": "tokonya@dwiky.com",
                "password": "tokonyadwiky"
            })
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(401)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('Kredensial yang Anda berikan salah')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login using invalid email format', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send({
                "email": "toko@dwiky",
                "password": "toko24dwiky"
            })
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(400)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('\"email\" must be a valid email')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login without any input', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send()
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(400)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('\"value\" must be of type object')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint User /users', function () {
    //Endpoint /users
    //Users - Create User
    it('Success create user cashier', (done) => {
        request(baseUrl)
            .post('/users')
            .send(addUser)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil ditambahkan')
                expect(await response.body.data.userId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addUser.name)
                userId = response.body.data.userId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User Detail
    it('Success get user detail', (done) => {
        request(baseUrl)
            .get('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.user.id).not.to.be.null
                expect(await response.body.data.user.name).not.to.be.null
                expect(await response.body.data.user.name).to.be.equal(addUser.name)
                expect(await response.body.data.user.email).not.to.be.null
                expect(await response.body.data.user.email).to.be.equal(addUser.email)
                expect(await response.body.data.user.role).not.to.be.null
                expect(await response.body.data.user.role).to.be.equal('kasir')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User List
    it('Success get user list', (done) => {
        request(baseUrl)
            .get('/users')
            .query({
                q: 'kasir',
                p: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Update User
    it('Success update user', (done) => {
        request(baseUrl)
            .put('/users/' + userId)
            .send(updateUser)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil diupdate')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateUser.name)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Delete User
    it('Success delete user', (done) => {
        request(baseUrl)
            .del('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil dihapus')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint Unit /units', function () {
    //Endpoint /units
    //Units - Add Unit
    it('Success add unit', (done) => {
        request(baseUrl)
            .post('/units')
            .send(addUnit)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Unit berhasil ditambahkan')
                expect(await response.body.data.unitId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addUnit.name)
                unitId = response.body.data.unitId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Get Unit Detail
    it('Success get unit detail', (done) => {
        request(baseUrl)
            .get('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.unit.name).not.to.be.null
                expect(await response.body.data.unit.name).to.be.equal(addUnit.name)
                expect(await response.body.data.unit.description).not.to.be.null
                expect(await response.body.data.unit.description).to.be.equal(addUnit.description)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Get Unit List
    it('Success get unit list', (done) => {
        request(baseUrl)
            .get('/units')
            .query({
                q: 'gram',
                page: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Update Unit
    it('Success update unit', (done) => {
        request(baseUrl)
            .put('/units/' + unitId)
            .send(updateUnit)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateUnit.name)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Delete Unit
    it('Success delete unit', (done) => {
        request(baseUrl)
            .del('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint Category /categories', function () {
    //Endpoint /categories
    //Categories - Add Category
    it('Success add category', (done) => {
        request(baseUrl)
            .post('/categories')
            .send(addCategory)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Category berhasil ditambahkan')
                expect(await response.body.data.categoryId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addCategory.name)
                categoryId = response.body.data.categoryId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Get Category Detail
    it('Success get category detail', (done) => {
        request(baseUrl)
            .get('/categories/' + categoryId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.category.name).not.to.be.null
                expect(await response.body.data.category.name).to.be.equal(addCategory.name)
                expect(await response.body.data.category.description).not.to.be.null
                expect(await response.body.data.category.description).to.be.equal(addCategory.description)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Get Category List
    it('Success get category list', (done) => {
        request(baseUrl)
            .get('/categories')
            .query({
                page: 1,
                q: 'makanan'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Update Category
    it('Success update category', (done) => {
        request(baseUrl)
            .put('/categories/' + categoryId)
            .send(updateCategory)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateCategory.name)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Delete Category
    it('Success delete category', (done) => {
        request(baseUrl)
            .del('/categories/' + categoryId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Success add category again', (done) => {
        request(baseUrl)
            .post('/categories')
            .send(addCategory)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Category berhasil ditambahkan')
                expect(await response.body.data.categoryId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addCategory.name)
                categoryId = response.body.data.categoryId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint Customer /customers', function () {
    //Endpoint /customers
    //Customers - Add customer
    it('Success add customer', (done) => {
        request(baseUrl)
            .post('/customers')
            .send(addCustomer)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Customer berhasil ditambahkan')
                expect(await response.body.data.customerId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addCustomer.name)
                customerId = response.body.data.customerId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Customers - Get Customer Detail
    it('Success get customer detail', (done) => {
        request(baseUrl)
            .get('/customers/' + customerId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.customer.name).not.to.be.null
                expect(await response.body.data.customer.name).to.be.equal(addCustomer.name)
                expect(await response.body.data.customer.phone).not.to.be.null
                expect(await response.body.data.customer.phone).to.be.equal(addCustomer.phone)
                expect(await response.body.data.customer.address).not.to.be.null
                expect(await response.body.data.customer.address).to.be.equal(addCustomer.address)
                expect(await response.body.data.customer.description).not.to.be.null
                expect(await response.body.data.customer.description).to.be.equal(addCustomer.description)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Customers - Get Customer List
    it('Success get customer list', (done) => {
        request(baseUrl)
            .get('/customers')
            .query({
                page: 1,
                q: 'Budi'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Customers - Update Customer
    it('Success update customer', (done) => {
        request(baseUrl)
            .put('/customers/' + customerId)
            .send(updateCustomer)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateCustomer.name)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Delete Customer
    it('Success delete customer', (done) => {
        request(baseUrl)
            .del('/customers/' + customerId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Success add customer again', (done) => {
        request(baseUrl)
            .post('/customers')
            .send(addCustomer)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Customer berhasil ditambahkan')
                expect(await response.body.data.customerId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addCustomer.name)
                customerId = response.body.data.customerId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint Product /products', function () {
    //Endpoint /products
    //Products - Add Product
    it('Success add product', (done) => {
        request(baseUrl)
            .post('/products')
            .send({
                category_id: categoryId,
                code: "A314ASDDFIER3432",
                name: "taro",
                price: 3500,
                cost: 3000,
                stock: 5
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Product berhasil ditambahkan')
                expect(await response.body.data.productId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal("taro")
                productId = response.body.data.productId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Get Product Detail
    it('Success get product detail', (done) => {
        request(baseUrl)
            .get('/products/' + productId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.product.code).not.to.be.null
                expect(await response.body.data.product.name).not.to.be.null
                expect(await response.body.data.product.name).to.be.equal("taro")
                expect(await response.body.data.product.price).not.to.be.null
                expect(await response.body.data.product.price).to.be.equal(3500)
                expect(await response.body.data.product.cost).not.to.be.null
                expect(await response.body.data.product.cost).to.be.equal(3000)
                expect(await response.body.data.product.stock).not.to.be.null
                expect(await response.body.data.product.stock).to.be.equal(5)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Get Product List
    it('Success get product list', (done) => {
        request(baseUrl)
            .get('/products')
            .query({
                page: 1,
                q: "taro",
                withStock: true,
                withCategory: true,
                categoryId: categoryId
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Update Product
    it('Success update product', (done) => {
        request(baseUrl)
            .put('/products/' + productId)
            .send({
                "category_id": categoryId,
                "code": "A314ASDDFIER3432",
                "name": "taro",
                "price": 3500,
                "cost": 3000,
                "stock": 100
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal('taro')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Delete Product
    it('Success delete product', (done) => {
        request(baseUrl)
            .del('/products/' + productId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Add Product
    it('Success add product again', (done) => {
        request(baseUrl)
            .post('/products')
            .send({
                category_id: categoryId,
                code: "A314ASDDFIER3432",
                name: "taro",
                price: 3500,
                cost: 3000,
                stock: 50
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Product berhasil ditambahkan')
                expect(await response.body.data.productId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal("taro")
                productId = response.body.data.productId
                productCode = response.body.data.code
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint Sales Order /sales and Transaction /purchases', function () {
    //Endpoint /sales
    //Transaction - Add Sale
    it('Success add sales', (done) => {
        request(baseUrl)
            .post('/sales')
            .send({
                "officeId": officeId,
                "customerId": customerId,
                "date": "2023-02-01",
                "invoice": "INV001",
                "amount": 2000,
                "discount": 0,
                "description": "Pembelian pertama",
                "items": [
                    {
                        "productId": productId,
                        "quantity": 1,
                        "price": 2000
                    }
                ]
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('transaksi ditambahkan')
                expect(await response.body.data.saleId).not.to.be.null
                saleId = response.body.data.saleId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get List Sales Data
    it('Success get list sales data', (done) => {
        request(baseUrl)
            .get('/sales')
            .query({
                startDate: "2023-01-01",
                endDate: "2023-12-31"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get Sales Order Data
    it('Success get sales order data', (done) => {
        request(baseUrl)
            .get('/sales/' + saleId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                done()
            })
    })

    //Transaction - Add Transaction
    it('Success add transaction', (done) => {
        request(baseUrl)
            .post('/purchases')
            .send({
                "officeId": officeId,
                "date": "2023-01-30",
                "invoice": "INV/02/20/2023/001",
                "amount": 14000,
                "discount": 0,
                "description": "test transaksi toko dwiky",
                "items": [
                    {
                        "productId": productId,
                        "quantity": 4,
                        "cost": 3500
                    }
                ]
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('transaksi ditambahkan')
                expect(await response.body.data.purchaseId).not.to.be.null
                purchaseId = response.body.data.purchaseId
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get List of Transaction
    it('Success get list of transaction', (done) => {
        request(baseUrl)
            .get('/purchases/' + purchaseId)
            .query({
                startDate: "2023-01-01",
                endDate: "2023-12-31"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.purchase.date).not.to.be.null
                expect(await response.body.data.purchase.invoice).not.to.be.null
                expect(await response.body.data.purchase.description).not.to.be.null
                expect(await response.body.data.purchase.amount).not.to.be.null
                expect(await response.body.data.purchase.discount).not.to.be.null
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get Transaction Detail
    it('Success get transaction detail', (done) => {
        request(baseUrl)
            .get('/purchases/' + purchaseId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.purchase.date).not.to.be.null
                expect(await response.body.data.purchase.invoice).not.to.be.null
                expect(await response.body.data.purchase.description).not.to.be.null
                expect(await response.body.data.purchase.amount).not.to.be.null
                expect(await response.body.data.purchase.discount).not.to.be.null
                expect(await response.body.data.purchase.description).to.be.equal('test transaksi toko dwiky')
                expect(await response.body.data.purchase.creator).to.be.equal('Toko Dwiky')
                expect(await response.body.data.purchase.office_name).to.be.equal('office-Toko Dwiky')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
})