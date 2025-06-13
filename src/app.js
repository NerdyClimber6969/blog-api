require('dotenv').config();
const path = require('node:path'); 
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { jwtAuthen } = require('./middlewares/authenMiddlewares.js');
const authenRouter = require('./routes/authenRouter.js');
const postRouter = require('./routes/postRouter.js');
const commentRouter = require('./routes/commentRouter.js');
const profileRouter = require('./routes/profileRouter.js');
const { handleError } = require('./middlewares/errorMiddlewares.js');
const { ResourceNotFoundError } = require('./errors/Error.js');

const app = express();

const corsOptions = {
    origin: [
        process.env.BLOG_STUDIO_URL || 'http://localhost:3001', 
        process.env.BLOG_APP_URL || 'http://localhost:3002',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(['/posts', '/comments', '/profiles'], jwtAuthen);

app.use('/authen', authenRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter)
app.use('/profiles', profileRouter);

// error handling middlewares
app.use(handleError);

app.use((req, res, next) => {
    const notFoundError = new ResourceNotFoundError('Requested resouce not found')

    res.status(404).json({
        success: false,
        errors: notFoundError.toJSON()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Current NODE_ENV is set to ${process.env.NODE_ENV} and now listening on PORT ${PORT}!`));