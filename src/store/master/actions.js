import firestore from '../../firestore/firestore'

export const findUser = ({state, commit}, payload) => {
  let promise = new Promise((resolve, reject) => {
    console.log('getting user', payload)
    firestore.collection('users').where('email', '==', payload)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          throw new Error('This email adress has not been registered. Please contact your administrator')
        } else {
          snapshot.forEach((doc) => {
            let user = doc.data()
            if (user.uid) {
              throw new Error('User profile already exists. Please log in with existing user details')
            } else {
              commit('setUserKey', doc.id)
              resolve(user)
            }
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
  return promise
}
