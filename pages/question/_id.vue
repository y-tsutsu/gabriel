 <template>
  <section class="section no-top-pad">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ question.title }}</strong>
              <br />
              <small>{{ question.user && question.user.name }}</small>
              <small>{{
                this.$moment(question.createdAt).format("YYYY.MM.DD - h:mm a")
              }}</small>
            </p>
          </div>
        </div>
      </article>
    </div>
    <div>
      <article class="media">
        <figure class="media-left">
          <p class="image is-48x48"></p>
        </figure>
        <div class="media-content">
          <div class="content">
            <AnswerList
              v-for="(a, index) in allAnswers"
              :key="index"
              :answer="a"
              :questionId="question.id"
            />
          </div>
        </div>
      </article>
    </div>
    <br />
    <article class="media">
      <div v-if="isLogin" class="media-content">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              name="answerText"
              v-model="answer"
              v-validate="'required'"
              placeholder="回答を⼊⼒してください！ "
            ></textarea>
            <p v-show="errors.has('answerText')" class="help is-danger">
              {{ errors.first("answerText") }}
            </p>
          </div>
        </div>
        <div class="field">
          <p class="control">
            <button class="button" @click="onAnsewer">質問に回答</button>
          </p>
        </div>
      </div>
      <div v-else>アカウントを作成して質問に回答しましょう！</div>
    </article>
  </section>
</template>

<script>
import apiJobMixin from "@/mixins/apiJobMixin";
// 作成したリスト⽤のコンポーネントを作成
import AnswerList from "@/components/AnswerList";
export default {
  data() {
    return {
      answer: "", // ⼊⼒されたinput⽤のデータ
    };
  },
  components: {
    AnswerList,
  },
  computed: {
    question() {
      return this.$store.getters["question/question"];
    },
    allAnswers() {
      // computedでgetterで回答全件を取得
      return this.$store.getters["answer/answersAll"];
    },
  },
  methods: {
    onAnsewer() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch("answer/addAnswer", {
            answer: this.answer,
            userId: this.$store.getters.user.id,
            questionId: this.question.id,
          });
        }
      });
    },
    jobsDone() {
      console.log("job done");
    },
  },
  mixins: [apiJobMixin],
  async fetch({ app, route, store }) {
    // fetchメソッドでSSR⽤のデータをfetchする
    let questionId = route.params.id;
    // 質問データのfetch
    await store.dispatch("question/fetchQuestion", questionId);
    // 回答データのfetch
    await store.dispatch("answer/fetchAnswersAll", questionId);
  },
};
</script>
