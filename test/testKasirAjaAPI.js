const request = require('supertest')
const { expect } = require('chai')
const baseUrl = 'https://kasir-api.belajarqa.com'
const userRegistration = require('../testData/userRegistration.json')
const userLogin = require('../testData/userLogin.json')
const createUser = require('../testData/createUser.json')
const addUnit = require('../testData/addUnit.json')
const addCategory = require('../testData/addCategory.json')
const addCustomer = require('../testData/addCustomer.json')
const addProduct = require('../testData/addProduct.json')
const addSales = require('../testData/addSales.json')
const addTransaction = require('../testData/addTransaction.json')

describe('Kasir Aja API Test', function () {

    var token
    var officeId
    var userId
    var unitId
    var categoryId
    var productId
    var saleId
    var purchaseId

    before(function (done) {
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

    //Authorization - Registration
    it('Should successfully create user registration', (done) => {
        request(baseUrl)
            .post('/registration')
            .send(userRegistration)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Toko berhasil didaftarkan')
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(userRegistration.name)
                expect(response.body.data.email).not.to.be.null
                expect(response.body.data.email).to.be.equal(userRegistration.email)
                expect(response.body.data.password).not.to.be.null
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Authorization - Login
    it('Should successfully login', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send(userLogin)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Authentication berhasil ditambahkan')
                expect(response.body.data.accessToken).not.to.be.null
                expect(response.body.data.refreshToken).not.to.be.null
                expect(response.body.data.user.id).not.to.be.null
                expect(response.body.data.user.name).not.to.be.null
                expect(response.body.data.user.name).to.be.equal(userRegistration.name)
                expect(response.body.data.user.role).not.to.be.null
                expect(response.body.data.user.role).to.be.equal('admin')
                expect(response.body.data.user.email).not.to.be.null
                expect(response.body.data.user.email).to.be.equal(userRegistration.email)
                expect(response.body.data.user.company_name).not.to.be.null
                expect(response.body.data.user.company_name).to.be.equal(userRegistration.name)
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Endpoint /users
    //Users - Create User
    it('Should successfully create user', (done) => {
        request(baseUrl)
            .post('/users')
            .send(createUser)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('User berhasil ditambahkan')
                expect(response.body.data.userId).not.to.be.null
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(createUser.name)
                // console.log(response.body)
                userId = response.body.data.userId
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User Detail
    it('Should successfully get user detail', (done) => {
        request(baseUrl)
            .get('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.data.user.id).not.to.be.null
                expect(response.body.data.user.name).not.to.be.null
                expect(response.body.data.user.name).to.be.equal(createUser.name)
                expect(response.body.data.user.email).not.to.be.null
                expect(response.body.data.user.email).to.be.equal(createUser.email)
                expect(response.body.data.user.role).not.to.be.null
                expect(response.body.data.user.role).to.be.equal('kasir')
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User List
    it('Should successfully get user list', (done) => {
        request(baseUrl)
            .get('/users')
            .query({
                q: 'kasir-serbaguna',
                p: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Update User
    it('Should successfully update user', (done) => {
        request(baseUrl)
            .put('/users/' + userId)
            .send({
                "name": "update-user",
                "email": "user@example.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal('update-user')
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('User berhasil diupdate')
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User List
    it('Should successfully delete user', (done) => {
        request(baseUrl)
            .del('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('User berhasil dihapus')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //================================================================================
    //Endpoint /units
    //Units - Add Unit
    it('Should successfully add unit', (done) => {
        request(baseUrl)
            .post('/units')
            .send(addUnit)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Unit berhasil ditambahkan')
                expect(response.body.data.unitId).not.to.be.null
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(addUnit.name)
                unitId = response.body.data.unitId
                if (err) {
                    throw err
                }
                // console.log(response.body)
                done()
            })
    })

    //Units - Get Unit Detail
    it('Should successfully get unit detail', (done) => {
        request(baseUrl)
            .get('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.unit.name).not.to.be.null
                expect(response.body.data.unit.name).to.be.equal(addUnit.name)
                expect(response.body.data.unit.description).not.to.be.null
                expect(response.body.data.unit.description).to.be.equal(addUnit.description)
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Get Unit List
    it('Should successfully get unit list', (done) => {
        request(baseUrl)
            .get('/units')
            .query({
                q: 'gram',
                page: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Update Unit
    it('Should successfully update unit', (done) => {
        request(baseUrl)
            .put('/units/' + unitId)
            .send({
                "name": "update-meter",
                "description": "no-meter"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal('update-meter')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Delete Unit
    it('Should successfully update unit', (done) => {
        request(baseUrl)
            .del('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //================================================================================
    //Endpoint /categories
    //Categories - Add Category
    it('Should successfully add category', (done) => {
        request(baseUrl)
            .post('/categories')
            .send(addCategory)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.data.categoryId).not.to.be.null
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(addCategory.name)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Category berhasil ditambahkan')
                categoryId = response.body.data.categoryId
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Get Category Detail
    it('Should successfully get category detail', (done) => {
        request(baseUrl)
            .get('/categories/' + categoryId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.data.category.name).not.to.be.null
                expect(response.body.data.category.name).to.be.equal(addCategory.name)
                expect(response.body.data.category.description).not.to.be.null
                expect(response.body.data.category.description).to.be.equal(addCategory.description)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Get Category List
    it('Should successfully get category list', (done) => {
        request(baseUrl)
            .get('/categories')
            .query({
                page: 1,
                q: 'makanan'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Update Category
    it('Should successfully update category', (done) => {
        request(baseUrl)
            .put('/categories/' + categoryId)
            .send({
                "name": "update-minuman",
                "description": "no-minuman"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal('update-minuman')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Categories - Delete Category
    it('Should successfully delete category', (done) => {
        request(baseUrl)
            .del('/categories/' + categoryId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //================================================================================
    //Endpoint /customers
    //Customers - Add customer
    it('Should successfully add customer', (done) => {
        request(baseUrl)
            .post('/customers')
            .send(addCustomer)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Customer berhasil ditambahkan')
                expect(response.body.data.customerId).not.to.be.null
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(addCustomer.name)
                customerId = response.body.data.customerId
                if (err) {
                    throw err
                }
                // console.log(response.body)
                done()
            })
    })

    //Customers - Get Customer Detail
    it('Should successfully get customer detail', (done) => {
        request(baseUrl)
            .get('/customers/' + customerId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.customer.name).not.to.be.null
                expect(response.body.data.customer.name).to.be.equal(addCustomer.name)
                expect(response.body.data.customer.phone).not.to.be.null
                expect(response.body.data.customer.phone).to.be.equal(addCustomer.phone)
                expect(response.body.data.customer.address).not.to.be.null
                expect(response.body.data.customer.address).to.be.equal(addCustomer.address)
                expect(response.body.data.customer.description).not.to.be.null
                expect(response.body.data.customer.description).to.be.equal(addCustomer.description)
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Customers - Get Customer List
    it('Should successfully get customer list', (done) => {
        request(baseUrl)
            .get('/customers')
            .query({
                page: 1,
                q: 'Budi'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Customers - Update Customer
    it('Should successfully update customer', (done) => {
        request(baseUrl)
            .put('/customers/' + customerId)
            .send({
                "name": "Budi Doremi",
                "phone": "08987654321",
                "address": "Bandung",
                "description": "Pelanggan VIP"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal('Budi Doremi')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Units - Delete Unit
    it('Should successfully delete unit', (done) => {
        request(baseUrl)
            .del('/customers/' + customerId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //================================================================================
    //Endpoint /products
    //Products - Add Product
    it('Should successfully add product', (done) => {
        request(baseUrl)
            .post('/products')
            .send(addProduct)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('Product berhasil ditambahkan')
                expect(response.body.data.productId).not.to.be.null
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal(addProduct.name)
                productId = response.body.data.productId
                if (err) {
                    throw err
                }
                // console.log(response.body)
                done()
            })
    })

    //Products - Get Product Detail
    it('Should successfully get product detail', (done) => {
        request(baseUrl)
            .get('/products/' + productId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.product.code).not.to.be.null
                expect(response.body.data.product.code).to.be.equal(addProduct.code)
                expect(response.body.data.product.name).not.to.be.null
                expect(response.body.data.product.name).to.be.equal(addProduct.name)
                expect(response.body.data.product.price).not.to.be.null
                expect(response.body.data.product.price).to.be.equal(parseInt(addProduct.price))
                expect(response.body.data.product.cost).not.to.be.null
                expect(response.body.data.product.cost).to.be.equal(parseInt(addProduct.cost))
                expect(response.body.data.product.stock).not.to.be.null
                expect(response.body.data.product.stock).to.be.equal(parseInt(addProduct.stock))
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Get Product List
    it('Should successfully get product list', (done) => {
        request(baseUrl)
            .get('/products')
            .query({
                page: 1,
                q: "taro",
                withStock: true,
                withCategory: true,
                categoryId: "a8851b17-9de-4c66-bc16-d4279a9a7c77"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Update Product
    it('Should successfully update product', (done) => {
        request(baseUrl)
            .put('/products/' + productId)
            .send({
                "category_id": "811f547e-a24e-4f94-bfe1-b7ed7d11c03f",
                "code": "A314ASDDFIER3432",
                "name": "taro",
                "price": "3500",
                "cost": "3000",
                "stock": "1"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.name).not.to.be.null
                expect(response.body.data.name).to.be.equal('taro')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Products - Delete Product
    it('Should successfully delete product', (done) => {
        request(baseUrl)
            .del('/products/' + productId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //================================================================================
    //Endpoint /sales
    //Transaction - Add Sale
    it('Should successfully add sales', (done) => {
        request(baseUrl)
            .post('/sales')
            .send(addSales)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('transaksi ditambahkan')
                expect(response.body.data.saleId).not.to.be.null
                saleId = response.body.data.saleId
                if (err) {
                    throw err
                }
                // console.log(response.body)
                done()
            })
    })
    
    //Transaction - Get List Sales Data
    it('Should successfully get list sales data', (done) => {
        request(baseUrl)
            .get('/sales')
            .query({
                startDate: "2023-01-08",
                endDate: "2023-02-08"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get Sales Order Data
    it('Should successfully get sales order data', (done) => {
        request(baseUrl)
            .get('/sales/' + saleId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                // console.log(response.body)
                done()
            })
    })

    //Transaction - Add Transaction
    it('Should successfully add transaction', (done) => {
        request(baseUrl)
            .post('/purchases')
            .send(addTransaction)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(201)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.message).to.be.equal('transaksi ditambahkan')
                expect(response.body.data.purchaseId).not.to.be.null
                // console.log(response.body)
                purchaseId = response.body.data.purchaseId
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get List of Transaction
    it('Should successfully get list of transaction', (done) => {
        request(baseUrl)
            .get('/purchases/' + purchaseId)
            .query({
                startDate: 2023-01-29,
                endDate: 2023-01-30,
                q: "",
                page: ""
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.purchase.date).not.to.be.null
                expect(response.body.data.purchase.invoice).not.to.be.null
                expect(response.body.data.purchase.invoice).to.be.equal(addTransaction.invoice)
                expect(response.body.data.purchase.description).not.to.be.null
                expect(response.body.data.purchase.description).to.be.equal(addTransaction.description)
                expect(response.body.data.purchase.amount).not.to.be.null
                expect(response.body.data.purchase.amount).to.be.equal(addTransaction.amount)
                expect(response.body.data.purchase.discount).not.to.be.null
                expect(response.body.data.purchase.discount).to.be.equal(addTransaction.discount)
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Transaction - Get Transaction Detail
    it('Should successfully get transaction detail', (done) => {
        request(baseUrl)
            .get('/purchases/' + purchaseId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(function (err, response) {
                expect(response.statusCode).to.be.equal(200)
                expect(response.body.status).to.be.equal('success')
                expect(response.body.data.purchase.date).not.to.be.null
                expect(response.body.data.purchase.invoice).not.to.be.null
                expect(response.body.data.purchase.invoice).to.be.equal(addTransaction.invoice)
                expect(response.body.data.purchase.description).not.to.be.null
                expect(response.body.data.purchase.description).to.be.equal(addTransaction.description)
                expect(response.body.data.purchase.amount).not.to.be.null
                expect(response.body.data.purchase.amount).to.be.equal(addTransaction.amount)
                expect(response.body.data.purchase.discount).not.to.be.null
                expect(response.body.data.purchase.discount).to.be.equal(addTransaction.discount)
                // console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })
})

