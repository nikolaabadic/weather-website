const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to server
app.use(express.static(publicDir))

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Nikola Abadic'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About me',
        name: 'Nikola Abadic'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help',
        message: 'Contact us',
        name: 'Nikola Abadic'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404page',{
        title: 'Error',
        errorMessage: 'Help article not found!',
        name: 'Nikola Abadic'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: "Address must be provided!"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error
            })
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                forecast:forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('*', (req, res) => {
    res.render('404page',{
        title: 'Error',
        errorMessage: 'Page not found!',
        name: 'Nikola Abadic'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})