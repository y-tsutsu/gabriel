
export const state = () => ({
  questions: [] // すべての質問データを格納する配列
});

export const mutations = {
  setQuestionsAll(state, payload) {
    state.questions = payload;
  }
};

export const actions = {
  addQuestion({ commit, state, dispatch }, payload) {
    commit("setBusy", true, { root: true });
    commit("clearError", null, { root: true });
    const db = this.$fireApp.firestore();
    // クエスチョンを登録
    let questionRef = db.collection("questions");
    questionRef
      .add({
        title: payload.question,
        userRef: db.collection("users").doc(payload.userId),
        createdAt: new Date().toISOString()
      })
      .then(() => {
        dispatch("fetchQuestionsAll");
        commit("setBusy", false, { root: true });
        commit("setJobDone", true, { root: true });
      });
  },
  async fetchQuestionsAll({ commit, state }, payload) {
    const db = this.$fireApp.firestore();

    // 登録した全データを取得
    let questions = [];
    const querySnapshot = await db.collection("questions").get();

    // 質問データをfetch
    querySnapshot.forEach(doc => {
      questions.push({
        id: doc.id, // 質問ごとのID
        ...doc.data()
      });
    });

    // storeのデータを作成
    let storeData = [];
    for (let i = 0; i < questions.length; i++) {
      let q = questions[i];
      // リレーションデータの取得
      const userQuerySnapshot = await q.userRef.get();
      const userID = await q.userRef.id;
      storeData.push({
        title: q && q.title,
        id: q && q.id,
        createdAt: q && q.createdAt,
        user: {
          ...userQuerySnapshot.data(),
          id: userID
        }
      });
    }
    commit("setQuestionsAll", storeData);
  },
  async updateQuestion({ commit, state, dispatch }, payload) {
    commit("setBusy", true, { root: true });
    commit("clearError", null, { root: true });
    const db = this.$fireApp.firestore();
    await db
      .collection("questions")
      .doc(payload.id)
      .update({
        title: payload.updateText,
        updateAt: new Date().toISOString()
      })
      .then(() => {
        console.log("Document successfully update!");
        commit("setBusy", false, { root: true });
        commit("setJobDone", true, { root: true });
      });
    dispatch("fetchQuestionsAll");
  },
  async removeQuestion({ commit, state, dispatch }, payload) {
    commit("setBusy", true, { root: true });
    commit("clearError", null, { root: true });
    const db = this.$fireApp.firestore();
    await db
      .collection("questions")
      .doc(payload)
      .delete()
      .then(function () {
        console.log("Document successfully delete question!");
        commit("setBusy", false, { root: true });
        commit("setJobDone", true, { root: true });
      });
    await db
      .collection("answers")
      .doc(payload)
      .delete()
      .then(function () {
        console.log("Document successfully delete answers!");
        commit("setBusy", false, { root: true });
        commit("setJobDone", true, { root: true });
      });
    dispatch("fetchQuestionsAll");
  }
};

export const getters = {
  questionsAll(state) {
    return state.questions;
  }
};
