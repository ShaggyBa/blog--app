//* Imports
import { Question } from './question'
import { createModal, isValid, isValidName } from './utils'
import { authWithEmailAndPassword, getAuthForm } from './auth'
import './styles.css'


// * Variables
const form = document.getElementById('form')

const modalBtn = document.getElementById('modal--btn')

const input = form.querySelector('#question-input')

const personName = form.querySelector('#name-input')

const submitBtn = form.querySelector('#submit')


//! Events
window.addEventListener('load', Question.renderList)

form.addEventListener('submit', submitFormHandler)

input.addEventListener('input', () => { submitBtn.disabled = !isValid(input.value) })

personName.addEventListener('input', () => { submitBtn.disabled = !isValidName(personName.value) })

modalBtn.addEventListener('click', openModal)

//! Functions
function submitFormHandler(event) {
	event.preventDefault()

	if (isValid(input.value) && isValidName(personName.value)) {
		const question = {
			personName: personName.value.trim(),
			text: input.value.trim(),
			date: new Date().toJSON()
		}
		submitBtn.disabled = true
		//! После получения объекта question необходимо отправить запрос на сервер для сохр вопроса
		//* Async request to server to save question 
		Question.create(question).then(() => {
			personName.value = ''
			personName.className = ''

			input.value = ''
			input.className = ''

			submitBtn.disabled = false
		})
	}
}

function openModal() {
	createModal('Авторизация', getAuthForm())
	document
		.getElementById('form--auth')
		.addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(event) {
	event.preventDefault()

	const email = event.target.querySelector('#email-input').value
	const password = event.target.querySelector('#password-input').value
	const btnAuth = event.target.querySelector('button')

	btnAuth.disabled = true

	authWithEmailAndPassword(email, password)
		.then(Question.fetch) //* Компактный способ, token автоматически занесется в fetch
		.then(renderModalAfterAuth)
		.then(() => btnAuth.disabled = false)
}

function renderModalAfterAuth(content) {
	if (typeof (content) === 'string') {
		createModal('Error!', content)
	} else {
		createModal('List of questions', Question.listToHTML(content))
	}
}