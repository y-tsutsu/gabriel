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
            <!-- ここに回答が⼊る-->
          </div>
        </div>
      </article>
    </div>
    <br />
    <article class="media">
      <div v-if="isLogin" class="media-content">
        <div class="field">
          <p class="control">
            <textarea
              class="textarea"
              v-model="answer"
              placeholder="回答を⼊⼒してください！ "
            ></textarea>
          </p>
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
export default {
  data() {
    return {
      answer: "",
    };
  },
  computed: {
    question() {
      return this.$store.getters["question/question"];
    },
  },
  methods: {
    onAnsewer() {
      this.$store.dispatch("answer/addAnswer", {
        answer: this.answer,
        userId: this.$store.getters.user.id,
        questionId: this.question.id,
      });
    },
    jobsDone() {
      console.log("job done");
    },
  },
  mixins: [apiJobMixin],
  async fetch({ app, route, store }) {
    // URLからクエスチョンIDを取得
    let questionId = route.params.id;
    // アクションにdispatch
    await store.dispatch("question/fetchQuestion", questionId);
  },
};
</script>
