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

PORT = 3000
const app = express();

const corsOptions = {
    origin: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/sign-up', authController.register);
app.post('/login', authController.login);

app.use(['/posts', '/comments', '/profiles'], jwtAuthen);
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