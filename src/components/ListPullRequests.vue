<template>
  <div class="list-pull-request">
    <div class="pr-title">Pull Requests List</div>
    <div class="pr-list">
      <div v-for="user in users" v-bind:key="user.username" class="pr-item">
        <div class="pr-username">{{user.username}}</div>
        <ul v-for="(pr, index) in user.pullRequests" v-bind:key="index" class="pr-content">
          <li>
            <a :href="pr" class="pr-link">{{pr}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'ListPullRequests',
  data: () => ({
    users: []
  }),
  async mounted () {
    try {
      let result = await api.getPulls(2019)
      this.users = result.data
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
  .list-pull-request {
    padding: 0 10px;
  }
  .pr-title {
    font-size: 20px;
    font-weight: bold;
    color: #0A5373;
    margin: 15px 0;
  }

  .pr-item {
    border-radius: 3px;
    padding: 5px;
    margin: 10px 0;
    background-color: rgba(255,184,86, .2);
  }

  .pr-username {
    color: #A64C44;
    font-weight: bold;
    font-size: 17px;
  }

  .pr-link {
    width: 100%;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    text-decoration: none;
    color: #09213E;

    &:hover {
      color: #F26B5E;
    }
  }

  @media screen and (min-width: 768px) {
    .list-pull-request {
      text-align: center;
    }

    .pr-title {
      font-size: 28px;
    }
    .pr-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .pr-item {
        border-radius: 10px;
        width: 25%;
        margin: 5px;
        background-color: rgba(255,184,86, .2);
        text-overflow: ellipsis;

        &:hover {
          -webkit-box-shadow: 0px 0px 10px -1px #A64C44;
          -moz-box-shadow: 0px 0px 10px -1px #A64C44;
          box-shadow: 0px 0px 10px -1px #A64C44;
        }
      }

      .pr-content {
        padding: 15px;
        list-style-type: none;
      }
    }
  }
</style>
