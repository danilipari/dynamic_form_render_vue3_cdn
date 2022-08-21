
const app = Vue.createApp({
  template: `
    <div class="container-fluid px-0">
      <div class="p-4" v-if="loaded && forms.length > 0">


        <form :name="name_form" class="form-group">
          <div class="mt-2" v-for="(element, index) in forms" :key="index">
            <!-- <p>{{ element }}</p>
            <hr> -->

            <div v-if="element.visible">
              <div class="d-flex justify-content-between">
                <label>{{ element.label }} {{ element.required ? '*' : '' }} </label>
                <small>{{ element.value }}</small>
                <p class="mb-0 text-muted">{{ element.description }}</p>
              </div>
              <input @click="setTouched(index)" class=" form-control form-control-lg " :class="{ 'border border-danger': requiredCheck(element) }" autocomplete="off" :name="element.name" :id="element.name" :type="element.inputType" :placeholder="element.placeholder" :disabled="!element.enabled" v-model="element.value">
              <div class="d-flex flex-column w-75 border border-danger mt-2 p-2 rounded" v-if="element.touched && (requiredCheck(element) || (!checkRegex(element.validation, element.value) && (element.validation !== '')))">
                <small class="text-danger" v-if="requiredCheck(element)">&#9679; Required</small>
                <small class="text-danger" v-if="!checkRegex(element.validation, element.value) && (element.validation !== '')">&#9679; Regex -  {{ element.validation !== "" ? element.validation : 'no-regex' }} </small>
              </div>
            </div>

          </div>
        </form>

        <div v-if="checkFormFields">
          <div class="alert alert-danger my-3" role="alert">
            <h4 class="alert-heading">Error!</h4>
            <p>Please complete all fields respecting the filling rules!</p>
          </div>
        </div>

        <div class="my-3">
          <button v-for="(element, indexB) in actions" :key="indexB" type="button" class="btn btn-primary mx-2" @click="action(indexB, element.href)">Button 1</button>
          <button type="button" class="btn btn-success" @click="checkValidityForm()">chekValidityForm</button>
        </div>



      </div>
    </div>
  `,
  data() {
    return {
      form_load: false,
      error: null,
      name_form: null,
      checkFormFields: false,
      forms: [],
      actions: [],
    };
  },
  computed: {
    /**
     * @author Dani Lipari
     * @description Check if apis in created() are available
     */
    loaded() {
      return this.form_load;
    },
  },
  methods: {
    /**
     * @author Dani Lipari
     * @description Check if value is required and if it is empty
     * @param {Object} element - form element
     * @returns {Boolean} - true if required and empty, false otherwise
     */
    requiredCheck(element) {
      return !!(element.required && element.value.length === 0);
    },
    /**
     * @author Dani Lipari
     * @description Function responsible for redirecting to the specified url or some action
     * @param {Number} index - index of form element
     * @param {String} href - href to redirect
     * @returns {none} - without return
     */
    action(index, href) {
      console.log(`action-${index}: ` + href);
    },
    /**
     * @author Dani Lipari
     * @description Same method as "cloneStructure()" in ES6, but without the need of a dependency
     * @param {any} element - elemento to 'clean'
     * @returns {any} - returns new array cleaned
     */
    cleanProxy(element) {
      return JSON.parse(JSON.stringify(element));
    },
    /**
     * @author Dani Lipari
     * @description Convert string into pattern valid as Regex pattern
     * @param {String} s - String regex to convert
     * @param {String} g - value
     * @returns {Boolean} - true if valid, false otherwise
     */
    stringToRegex(s, m = 'g') {
      return (m = s.match(/^([\/~@;%#'])(.*?)\1([gimsuy]*)$/)) ? new RegExp(m[2], m[3].split('').filter((i, p, s) => s.indexOf(i) === p).join('')) : new RegExp(s);
    },
    /**
     * @author Dani Lipari
     * @description On click set that form field is touched
     * @param {Number} index - regex to match
     * @returns {none} - without return
     */
    setTouched(index) {
      if (!Object.keys(this.forms[index]).includes('touched') && this.forms[index])
        this.forms[index].touched = true;
    },
    /**
     * @author Dani Lipari
     * @description Check if value is valid with regex
     * @param {String} regex - regex to check
     * @param {String} value - value to check
     * @returns {Boolean} - true if valid, false otherwise
     */
    checkRegex(regex, value) {
      if (value?.length !== 0) {
        return new RegExp(this.stringToRegex(regex)).test(value);
      } else {
        return false;
      }
    },
    /**
     * @author Dani Lipari
     * @description Check if all form fields are valid
     * @param {Array} form - form to check
     * @returns {Boolean} - true if all valid, false otherwise
     */
    checkValidityForm(form = this.cleanProxy(this.forms)) {
      const control = form.reduce((acc, item, index) => {
        let counter = 0;
        if (item.validation !== '') {
          if (!this.checkRegex(item.validation, item.value)) {
            counter++;
          }
        }
        if (item.required) {
          if (item.value.length === 0) {
            counter++;
          }
        }
        acc = [...acc, counter];

        return acc;
      }, []).every(field => field === 0);

      if (control === false) {
        form.map((upItem, index) => (this.setTouched(index)));
      }

      console.debug('checkValidityForm', control, form);

      this.checkFormFields = !control;
      return control;
    },
  },
  beforeCreate() {
    console.debug('app beforeCreate');
    console.log(
      document.getElementById('render-vue-app').getAttribute('data') === 'enabled' ? 'enabled' : 'unenabled',
      'RENDER'
    );
  },
  created() {
    console.debug('app created');
  },
  mounted() {
    console.debug('app mounted');

    if(true) {
      axios.get('https://formvue.mocklab.io/form/0')
      .then(response => {
        this.form_load = true;
        this.forms = response.data.forms;
        this.name_form = response.data.name_form;
        this.actions = response.data.actions;
      }).catch(error => (this.error = error));
    }

    if(false) {
      axios.post('https://formvue.mocklab.io/json/form', {
        first_name: 'Dani',
        last_name: 'Lipari',
        email: '',
        password: '',
      })
      .then(response => (console.log(response.status, 'response POST here')))
      .catch(error => (this.error = error));
    }

  },
});
app.mount("#render-vue-app");