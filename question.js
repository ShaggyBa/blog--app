const database = 'https://shaggyba-web-application-default-rtdb.firebaseio.com/questions.json'
//!question.json - Для создания коллекции

// * Нужен для группировки определенных методов, относящихся к вопросам
export class Question {
	static create(question) {
		return fetch(database, {
			method: 'POST', //* Для создания нового объекта
			body: JSON.stringify(question),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(response => {
				question.id = response.name
				return question
			})
			.then(addToLocalStorage)
			.then(Question.renderList)
	}

	// * Отображение списка вопросов на странице
	static renderList() {
		const listOfQuestions = getQuestionsFromLocalStorage()

		const html = listOfQuestions.length
			? listOfQuestions.map(toCard).join('')
			: `<div class="mui--text-headline">No questions...</div>`

		const list = document.getElementById('list')
		list.innerHTML = html
	}

	static fetch(token) {

		if (!token)
			return Promise.resolve(`<p class="error">You don't have a token</p>`)

		return fetch(`https://shaggyba-web-application-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
			.then(response => response.json())
			.then(response => {
				if (response && response.error) {
					return `<p class="error">${response.error}</p>`
				}
				// * Если ошибки нет (получен результат запроса с сервера - поле error отсут.), то необходимо вернуть 
				return response
					? Object.keys(response).map(key => ({
						...response[key], //* здесь находится текст и дата
						id: key
					}))
					: []
			})
	}

	static listToHTML(questions) {
		return questions.length
			? `
			<ol>${questions.map(question => `
			<li class="question"><p>${question.personName} - 
			${new Date(question.date).toLocaleDateString()}
			${new Date(question.date).toLocaleTimeString()}
			</p> 
			
			<p>${question.text}</p></li>`).join('')}
			</ol>
			<br>
			`

			: `<p>No questions yet :(</p>`
	}
}

// * Получение и занесение данных с локального хранилища
function addToLocalStorage(question) {
	const listOfQuestions = getQuestionsFromLocalStorage()
	listOfQuestions.push(question)
	localStorage.setItem('Questions', JSON.stringify(listOfQuestions))
}

function getQuestionsFromLocalStorage() {
	return JSON.parse(localStorage.getItem('Questions') || '[]')
}

function toCard(question) {
	return `
	<div class="question">
	<div class="mui--text-black-54">
	<div>${question.personName}</div>
	${new Date(question.date).toLocaleDateString()}
	${new Date(question.date).toLocaleTimeString()}
	</div>
	<div>${question.text}</div>
	</div>
	<br>
	`
}