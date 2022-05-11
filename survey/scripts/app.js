var app = Vue.createApp({
    el: '#app',
    template: '<flow-form v-bind:questions="questions" v-bind:language="language" />',
    data: function() {
      return {
        language: new VueFlowForm.LanguageModel({
            continue: 'Далее',
            pressEnter: ' ',
            otherPrompt: 'Andere',
            submitText: 'отправить',
            ok: "Готово",
            thankYouText: "Почти готово",
            successText: "Прямо сейчас мы сохраняем Ваши предпочтения и постараемся соответствовать им как можно точнее, чтобы предоставить уникальный опыт медитации.",
            percentCompleted: ":percent% пройдено"
        }),
        questions: [
          new VueFlowForm.QuestionModel({
            title: 'Question',
            type: VueFlowForm.QuestionType.MultipleChoice,
            required: true,
            options: [
              new VueFlowForm.ChoiceOption({
                label: 'Answer'
              })
            ]
          })
        ]
      }
    }
  }).component('FlowForm', VueFlowForm.FlowForm);
  
  const vm = app.mount('#app');

  function onSubmit(questionList) {
    // Handle submit event.
    const formData = new FormData()
  
    questionList.forEach(question => {
      formData.append(question.id, question.answer)
    })
  
    fetch("http://192.168.1.38:3000/access/hello", {
      method: 'POST',
      body: data
    }).then(response => Android.preferencesService_movingResultOut(response));
  }