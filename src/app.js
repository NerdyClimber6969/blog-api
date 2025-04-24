require('dotenv').config();
const path = require('node:path'); 
const express = require('express');
const cors = require('cors')
const authController = require('./controllers/authController.js');
const { jwtAuthen } = require('./middlewares/authenMiddlewares.js');
const postRouter = require('./routes/postRouter.js');
const commentRouter = require('./routes/commentRouter.js');
const profileRouter = require('./routes/profileRouter.js');
const { handleError } = require('./middlewares/errorMiddlewares.js');
const cookieParser = require('cookie-parser')

PORT = 3000
const app = express();

const corsOptions = {
    origin: 'http://localhost:3001',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(['/posts', '/comments', '/profiles', '/logout'], jwtAuthen);

app.post('/sign-up', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

// post route (i.e. /post/:postId)
app.use('/posts', postRouter);
app.use('/comments', commentRouter)
app.use('/profiles', profileRouter);

// error handling middlewares
app.use(handleError);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        errors: [{ message: "Sorry can't find the resource!" }]
    })
});

app.listen(PORT, () => console.log(`now listening on PORT ${PORT}!`));