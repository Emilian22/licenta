'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('licentadb', 'mrnobody22', '');
const cors = require('cors');
const multiparty = require('connect-multiparty')

let multiPartyMiddle = new multiparty();

let FileUploadController = require('./FileUploadController');

let app = express()
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())
app.use(cors())
let Admin = sequelize.define('admin', {
    aName: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    aPassword: {
        allowNull: false,
        type: Sequelize.STRING
    }
})
let Student = sequelize.define('student', {
    sName: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    sPassword: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    sEmail: {
        allowNull: false,
        type: Sequelize.STRING
    }
})
let Professor = sequelize.define('professor', {
    pName: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    pPassword: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    pEmail: {
        allowNull: false,
        type: Sequelize.STRING
    },
    pAcceptat: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})
let Course = sequelize.define('course', {
    cTitle: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    cDescription: {
        allowNull: false,
        type: Sequelize.TEXT
    },
    cBeginDate: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    cEndDate: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    cMaxDays: {
        allowNull: false,
        type: Sequelize.INTEGER
    }
})

let Chapter = sequelize.define('chapter', {
    chTitle: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    chDescription: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    chText: {
        allowNull: true,
        type: Sequelize.TEXT,
    },
    chBlob: {
        allowNull: true,
        type: Sequelize.STRING
    }
})
let Course_Student = sequelize.define('course_student', {
    csGrade: {
        allowNull: true,
        type: Sequelize.INTEGER,
    },
    csAcceptat: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})
let Course_Professor = sequelize.define('course_professor', {

})
let Comment = sequelize.define('comment', {
    comText: {
        allowNull: false,
        type: Sequelize.STRING
    }
})
let Pcomment = sequelize.define('pcomment', {
    pcomText: {
        allowNull: false,
        type: Sequelize.STRING
    }
})
let Quiz = sequelize.define('quiz', {

})

let Question = sequelize.define('question', {
    qText: {
        allowNull: false,
        type: Sequelize.STRING,
    }
})
let Answer = sequelize.define('answer', {
    aText: {
        allowNull: false,
        type: Sequelize.STRING
    },
    aTip: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})
Course.hasOne(Quiz, {
    foreignKey: 'idCourse',
    onDelete: 'cascade'
})
Course.hasMany(Chapter, {
    foreignKey: 'idCourse',
    onDelete: 'cascade'
})

Course.hasMany(Course_Student, {
    foreignKey: 'idCourse',
    onDelete: 'cascade'
})
Student.hasMany(Course_Student, {
    foreignKey: 'idStudent',
    onDelete: 'cascade'
})
Course.hasMany(Course_Professor, {
    foreignKey: 'idCourse',
    onDelete: 'cascade'
})
Professor.hasMany(Course_Professor, {
    foreignKey: 'idProfessor',
    onDelete: 'cascade'
})
Student.hasMany(Comment, {
    foreignKey: 'idStudent',
    onDelete: 'cascade'
})
Chapter.hasMany(Comment, {
    foreignKey: 'idChapter',
    onDelete: 'cascade'
})
Professor.hasMany(Pcomment, {
    foreignKey: 'idProfessor',
    onDelete: 'cascade'
})
Chapter.hasMany(Pcomment, {
    foreignKey: 'idChapter',
    onDelete: 'cascade'
})
Question.hasMany(Answer, {
    foreignKey: 'idQuestion',
    onDelete: 'cascade'
})
Quiz.hasMany(Question, {
    foreignKey: 'idQuiz',
    onDelete: 'cascade'
})


app.get('/create', (req, res) => {
    sequelize
        .sync({
            force: true
        })
        .then(() => {
            res.status(201).send('creat')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('eroare')
        })
})
app.post('/login_student', (req, res) => {
    Student
        .find({
            attributes: ['id', 'sName', 'sPassword'],
            where: {
                sName: req.body.sName,
                sPassword: req.body.sPassword
            }
        })
        .then((student) => {
            res.cookie("idStudent", student.id)
            res.status(200).send("" + student.id)
        })
        .catch((error) => {
            console.warn("nu a mers boss")
            res.status(500).send("pffbam")
        })
})
app.post('/login_profesor', (req, res) => {
    Professor
        .find({
            attributes: ['id', 'pName', 'pPassword'],
            where: {
                pName: req.body.pName,
                pPassword: req.body.pPassword
            }
        })
        .then((professor) => {
            console.warn(professor.id)
            res.status(200).send("" + professor.id)
        })
        .catch((error) => {
            console.warn("nu a mers boss 2")
            res.status(500).send("pffbam")
        })
})
app.post('/register_student', (req, res) => {
    Student
        .create(req.body)
        .then(() => {
            res.status(201).send('creat')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('eroare la creare')
        })
})
app.post('/register_profesor', (req, res) => {
    Professor
        .create(req.body)
        .then(() => {
            res.status(201).send('creat')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('eroare la creare')
        })
})
app.get('/courses', (req, res) => {
    Course
        .findAll({
            attributes: ['id', 'cTitle', 'cDescription', 'cBeginDate', 'cEndDate', 'cMaxDays']
        })
        .then((courses) => {
            res.status(200).send(courses)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('eroare')

        })
})
app.get('/courses/:id', (req, res) => {
    Course
        .find({
            attributes: ['id', 'cTitle', 'cDescription', 'cBeginDate', 'cEndDate', 'cMaxDays'],
            where: {
                id: req.params.id
            }
        })
        .then((course) => {
            res.status(200).send(course)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('eroare')
        })
})
app.post('/fisier', multiPartyMiddle, FileUploadController.uploadFile)
app.get('/professors/getProfessor/:pName', (req, res) => {
    Professor
        .find({
            where: {
                pName: req.params.pName
            }
        })
        .then((professor) => {
            console.warn(professor)
            if (professor != null) {
                res.status(200).send(true)
            }
            else {
                res.status(200).send(false)
            }
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/professors/get_name/:id', (req, res) => {
    Professor
        .find({
            attributes: ['pName'],
            where: {
                id: req.params.id
            }
        })
        .then((professor) => {
            res.status(200).send(professor)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/students/get_name/:id', (req, res) => {
    Student
        .find({
            attributes: ['sName'],
            where: {
                id: req.params.id
            }
        })
        .then((student) => {
            res.status(200).send(student)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/admins/get_name/:id', (req, res) => {
    Admin
        .find({
            attributes: ['aName'],
            where: {
                id: req.params.id
            }
        })
        .then((admin) => {
            res.status(200).send(admin)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/courses/:id/chapters', (req, res) => {
    Course
        .find({
            where: {
                id: req.params.id
            },
            include: [Chapter]
        })
        .then((course) => {
            return course.getChapters()
        })
        .then((chapters) => {
            res.status(200).send(chapters)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send("Eroare capitole")
        })
})
app.post('/courses/:id/chapters', (req, res) => {
    Course
        .find({
            where: {
                id: req.params.id
            },
            include: [Chapter]
        })
        .then((course) => {
            let chapter = req.body
            chapter.idCourse = course.id
            return Chapter.create(chapter)
        })
        .then(() => {
            res.status(200).send('capitol creat!')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/chapters/:id', (req, res) => {
    sequelize.query("(Select p.pName as 'userName', pc.pcomText as 'description',pc.createdAt from pcomments pc inner join professors p on pc.idProfessor=p.id where pc.idChapter = " + req.params.id + ") union all (select s.sName as 'userName',c.comText as 'description',c.createdAt from comments c  JOIN students s  ON c.idStudent = s.id WHERE c.idChapter = " + req.params.id + ") ORDER BY createdAt DESC;", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((comments) => {
            console.warn(comments)
            res.status(200).send(comments)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post('/chapters/', (req, res) => {
    Chapter
        .find({
            where: {
                id: req.body.chapterId
            },
            include: [Pcomment]
        })
        .then((chapter) => {
            let pcomment = req.body.comment
            pcomment.idChapter = chapter.id
            return Pcomment.create(pcomment)
        })
        .then((comment) => {
            res.status(200).send(comment)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
})
app.post('/chaptersS/', (req, res) => {
    Chapter
        .find({
            where: {
                id: req.body.chapterId
            },
            include: [Comment]
        })
        .then((chapter) => {
            let comment = req.body.comment
            comment.idChapter = chapter.id
            return Comment.create(comment)
        })
        .then((comment) => {
            res.status(200).send(comment)
        })
        .catch((error) => {
            res.status(500).send(error)
        })
})
app.post('/courses', (req, res) => {
    Course
        .create(req.body)
        .then((course) => {
            res.status(200).send(course)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post('/course_professors', (req, res) => {
    Course_Professor
        .create(req.body)
        .then(() => {
            res.status(200).send('legatura creata')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })

})
app.get('/course_professors/:id', (req, res) => {
    Course_Professor
        .findAll({
            where: {
                idProfessor: req.params.id,
            }
        })
        .then((course_professors) => {
            res.status(200).send(course_professors)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.delete('/courses/:id', (req, res) => {
    Course
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((course) => {
            return course.destroy()
        })
        .then(() => {
            res.status(201).send('cursul selectat a fost sters!')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.put('/courses/:id', (req, res) => {
    Course
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((course) => {
            return course.updateAttributes(req.body)
        })
        .then(() => {
            res.status(202).send('cursul selectat actualizat!')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.delete('/courses/:id/chapters/:id1', (req, res) => {
    Chapter
        .find({
            where: {
                id: req.params.id1
            }
        })
        .then((chapter) => {
            return chapter.destroy()
        })
        .then(() => {
            res.status(201).send('capitolul selectat a fost sters!')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/chaptersEdit/:id', (req, res) => {
    Chapter
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((chapter) => {
            res.status(200).send(chapter)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.put('/chaptersEdit/:id', (req, res) => {
    Chapter
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((chapter) => {
            return chapter.updateAttributes(req.body)
        })
        .then(() => {
            res.status(202).send('capitolul selectat actualizat!')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.put('/administration/professors/:id', (req, res) => {
    Professor
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((professor) => {
            professor.pAcceptat = true
            return professor.save()
        })
        .then(() => {
            res.status(200).send('profesorul a fost acceptat')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/myProfile/courses/:id', (req, res) => {
    sequelize.query("Select c.* from courses c inner join course_professors cp on c.id=cp.idCourse where cp.idProfessor=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((courses) => {
            res.status(200).send(courses)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post('/admin', (req, res) => {
    Admin
        .find({
            attributes: ['id', 'aName', 'aPassword'],
            where: {
                aName: req.body.aName,
                aPassword: req.body.aPassword
            }
        })
        .then((admin) => {
            res.cookie("idAdmin", admin.id)
            res.status(200).send("" + admin.id)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/administration/professors', (req, res) => {
    Professor
        .findAll({
            attributes: ['id', 'pName', 'pEmail'],
            where: {
                pAcceptat: false
            }
        })
        .then((professors) => {
            res.status(200).send(professors)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/professors/get_acceptat/:id', (req, res) => {
    Professor
        .find({
            attributes: ['pAcceptat'],
            where: {
                id: req.params.id,
            }
        })
        .then((professor) => {
            res.status(200).send(professor)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/courseStudents/:id/getLegatura/:id2', (req, res) => {
    Course_Student
        .find({
            where: {
                idCourse: req.params.id,
                idStudent: req.params.id2
            }
        })
        .then((course_student) => {
            if (course_student != null) {
                res.status(200).send(course_student)
            }
            else {
                res.status(200).send(false)
            }
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })

})
app.post("/courseStudents/", (req, res) => {
    Course_Student
        .create(req.body)
        .then(() => {
            res.status(200).send('cerere trimisa')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfile/studentCourses/:id", (req, res) => {
    sequelize.query("select s.sName, cs.idStudent,c.cTitle from students s inner join course_students cs on s.id=cs.idStudent inner join courses c on cs.idCourse=c.id where c.id=" + req.params.id + " and cs.csAcceptat=false;", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {

        })
})
app.put("/course_students/", (req, res) => {
    Course_Student
        .find({
            where: {
                idCourse: req.body.idCourse,
                idStudent: req.body.idStudent
            }
        })
        .then((course_student) => {
            course_student.csAcceptat = true;
            return course_student.save()
        })
        .then(() => {
            res.status(200).send("Legatura dintre student si curs a fost salvata!")
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/courseStudents/:id/getGrade/:id2", (req, res) => {
    Course_Student
        .find({
            attributes: ['csGrade', 'updatedAt'],
            where: {
                idCourse: req.params.id,
                idStudent: req.params.id2
            }
        })
        .then((course_student) => {
            res.status(200).send(course_student)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.delete("/course_students/:id1/:id2", (req, res) => {
    Course_Student
        .find({
            where: {
                idCourse: req.params.id1,
                idStudent: req.params.id2
            }
        })
        .then((course_student) => {
            return course_student.destroy()
        })
        .then(() => {
            res.status(200).send("Legatura dintre student si curs a fost stearsa!")
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.put("/courseStudents/", (req, res) => {
    Course_Student
        .find({
            where: {
                idCourse: req.body.idCourse,
                idStudent: req.body.idStudent
            }
        })
        .then((course_student) => {
            course_student.csGrade = req.body.nota;
            return course_student.save()
        })
        .then(() => {
            res.status(200).send("Nota a fost adaugata")
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/numberStudents", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from students", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/numberProfessors", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from professors", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/numberCourses", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from courses", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/courses/:id/quiz", (req, res) => {
    Quiz
        .find({
            where: {
                idCourse: req.params.id
            }
        })
        .then((quiz) => {
            if (quiz != null) {
                res.status(200).send(quiz)
            }
            else {
                res.status(201).send(false)
            }
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post("/courses/:id/quiz", (req, res) => {
    Quiz
        .create(req.body)
        .then((quiz) => {
            res.status(200).send(quiz)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/quiz/:id/questions", (req, res) => {
    Quiz
        .find({
            where: {
                idCourse: req.params.id
            },
            include: [Question]
        })
        .then((quiz) => {
            return quiz.getQuestions();
        })
        .then((questions) => {
            res.status(200).send(questions)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post("/quiz/:id/questions", (req, res) => {
    Quiz
        .find({
            where: {
                idCourse: req.params.id
            },
            include: [Question]
        })
        .then((quiz) => {
            let question = req.body
            question.idQuiz = quiz.id
            return Question.create(question)
        })
        .then((question) => {
            res.status(200).send(question)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/question/:id/answers", (req, res) => {
    Question
        .find({
            where: {
                id: req.params.id
            },
            include: [Answer]
        })
        .then((question) => {
            return question.getAnswers()
        })
        .then((answers) => {
            res.status(200).send(answers)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.post("/question/:id/answers", (req, res) => {
    Question
        .find({
            where: {
                id: req.params.id
            },
            include: [Answer]
        })
        .then((question) => {
            let answer = req.body
            answer.idQuestion = question.id
            return Answer.create(answer)
        })
        .then(() => {
            res.status(200).send("Raspunsul a fost creat")
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.delete("/question/:id", (req, res) => {
    Question
        .find({
            where: {
                id: req.params.id
            }
        })
        .then((question) => {
            return question.destroy()
        })
        .then(() => {
            res.status(200).send("Intrebarea a fost stearsa");
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get('/myProfileS/courses/:id', (req, res) => {
    sequelize.query("select c.*,cs.csGrade, cs.csAcceptat from courses c inner join course_students cs on c.id=cs.idCourse where cs.idStudent=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((courses) => {
            res.status(200).send(courses)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/fisier/:id/:id2", (req, res) => {
    res.sendfile("./uploads/" + req.params.id + "/" + req.params.id2 + "/File.pdf")
})
app.get("/numberActiveCourses", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from courses where cBeginDate<NOW() and cEndDate>NOW();", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/numberInactiveCourses", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from courses where cBeginDate>NOW() or cEndDate<NOW();", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfileS/:id/CursuriPromovate", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from course_students where csGrade>=5 and idStudent=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfileS/:id/CursuriNepromovate", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from course_students where csGrade<5 and csGrade>=0 and idStudent=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfileS/:id/CursuriNeterminate", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from course_students where csAcceptat=true and csGrade is NULL and idStudent=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfileS/:id/CursuriInAsteptare", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count from course_students where csAcceptat=false and idStudent=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.get("/myProfile/numberStudents/:id/:param", (req, res) => {
    sequelize.query("SELECT COUNT(*) as count, idCourse  from course_students where csAcceptat=true and idCourse=" + req.params.id + ";", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT
        })
        .then((response) => {
            var response2={
                count:response[0].count,
                idCourse:response[0].idCourse,
                pam:req.params.param
            }
            res.status(200).send(response2)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send(error)
        })
})
app.listen(8080)
