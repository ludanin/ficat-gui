/**
 * Seleciona atributos de um dado objeto de entrada,
 * com base em uma lista dos atributos do mesmo.
 * Aceita valores padrão que serão adicionados ou
 * sobrescritos pelo objeto de entrada ao objeto de saída.
 *
 * @param {Object} dataObj: carga útil de entrada
 *
 * @param {Array} attrList: lista de atributos selecionados do objeto
 *
 * @param {Object} defaults: inicia com `{}` caso não informado.
 * Caso `data` contenha algum atributo em comum com `defaults`,
 * esses valores serão sobrescritos no objeto de saída ou
 * serão apenas adicionados, caso contrário.
 *
 * @returns {Object} selected: objeto de saída
 *
 * @see utils.spec.js (/test/shared/ para casos de teste)
 */
function select(data, attrList, defaults = {}) {
  const dataObj = Object.assign({}, data) // Evitar problemas com hasOwnProperty
  if (dataObj && typeof dataObj === 'object') {
    if (dataObj.id) {
      delete dataObj.id
    }
    const selected = { ...defaults }
    for (const d in dataObj) {
      // hasOwnProperty - herança é ignorada
      if (dataObj.hasOwnProperty(d) && attrList.includes(d)) {
        selected[d] = dataObj[d]
      }
    }
    return selected
  }
}

/**
 * Valida atributos de um dado objeto de entrada,
 * com base em uma lista dos atributos do mesmo.
 *
 * @param {Object} data: carga útil de entrada (payload).
 * Valores de objeto vazio, não-objeto ou undefined, fazem
 * com que a função retorne undefined. Isto pode ser utilizado
 * para invalidar o payload.
 *
 * @param {Array} validFields: lista de atributos do objeto
 * válidos e deve conter todos os dados possíveis para o payload,
 * obrigatórios ou opcionais. Invalida o payload caso vazio.
 * (default: [])
 *
 * @param {Array} optional: indica quais campos válidos são opcionais
 * (default: [])
 *
 * @returns {Object}
 *  { valid: `true` -> `data` válido | `false` caso contrário,
 *    fields: `[campos inválidos]` -> caso `data` seja inválido
 *  }
 *
 * @see utils.spec.js (/test/shared/ para casos de teste)
 */
function validatePayload(data, validFields = [], optional = []) {
  const result = { valid: false }
  const dataObj = Object.assign({}, data) // Evitar problemas com hasOwnProperty
  if (dataObj && typeof dataObj === 'object' && Object.keys(dataObj).length) {
    // data precisa ter alguns campos
    for (const f of validFields) {
      if (!Object.keys(dataObj).includes(f) && !optional.includes(f)) {
        if (!result.missingFields) result.missingFields = []
        result.missingFields.push(f)
      }
    }
    // dataObj não deve ter alguns campos
    for (const d in dataObj) {
      // hasOwnProperty - não deve haver herança de objetos
      if (!dataObj.hasOwnProperty(d) || !validFields.includes(d)) {
        if (!result.invalidFields) result.invalidFields = []
        result.invalidFields.push(d)
      }
    }
    if (!result.invalidFields && !result.missingFields) result.valid = true
    return result
  } 
  // tentando validar autores q agora é uma array


  return undefined
}

/**
 * Separate array in array of arrays (size = chunkSize)
 *
 * @param   {Array} list - Elements
 * @param   {number} chunkSize - Size of nested array
 * @returns {Array}
 *
 * @example const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *          chunks(xs, 3) // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 */
function chunks(list, chunkSize) {
  const length = Math.ceil(list.length / chunkSize)

  return Array.from({ length }, (_, i) =>
    list.slice(i * chunkSize, i * chunkSize + chunkSize)
  )
}

/**
 * Modo de uso:
 * const obj = {a: 1, c: 3}
 * const r = {...maybe('a', obj.a), ...maybe('b', obj.c), ...maybe('c', false)}
 * r // => {a: 1, b: 3}
 * @param {*} key
 * @param {*} value
 */
function maybe(key, value) {
  return value && { [key]: value }
}

/**
 * 21 => uppercase ? XXI : xxi
 * @param {Number} n
 * @param {Boolean} uppercase
 */
function romanize(n, uppercase = false) {
  let r = ''
  const romans = {
    1: 'i',
    4: 'iv',
    5: 'v',
    9: 'ix',
    10: 'x',
    40: 'xl',
    50: 'l',
    90: 'xc',
    100: 'c',
    400: 'cd',
    500: 'd',
    900: 'cm',
    1000: 'm'
  }

  while (n > 0) {
    let choice
    for (const r in romans) {
      if (n >= r) choice = r
      else break
    }
    r += romans[choice]
    n -= choice
  }
  return uppercase ? r.toUpperCase() : r
}

exports.maybe = maybe
exports.romanize = romanize
exports.select = select
exports.chunks = chunks
exports.validatePayload = validatePayload
