<template>
  <div class="list-pull-request">
    <div class="pr-title">Pull Requests List</div>
    <div class="pr-list">
      <div
        v-for="(user, userIndex) in users"
        v-bind:key="user.username"
        class="pr-item"
      >
        <ul
          v-for="(pr, index) in user.pullRequests"
          v-bind:key="index"
          class="pr-content"
        >
          <li class="pr-li">
            <template v-if="userIndex < 3">
              <img
                class="medal"
                :src="require('@/assets/' + svgMedal(userIndex))"
              />
            </template>
            <div class="hover-effect">#{{ userIndex + 1 }}</div>
            <span class="pr-rank">#{{ userIndex + 1 }}</span>
            <div class="pr-username">{{ user.username }}</div>
            <a :href="pr" class="pr-link">{{ pr | cutPRLink }}</a>
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
      const result = await api.getPulls(2019)
      this.users = result.data
    } catch (error) {
      // eslint-disable-next-line
      console.log(error) 
    }
  },
  methods: {
    svgMedal (index) {
      if (index === 0) {
        return '003-gold-medal.svg'
      }
      if (index === 1) {
        return '001-silver-medal.svg'
      }
      if (index === 2) {
        return '002-bronze-medal.svg'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-pull-request {
  padding: 0 10px;
}

.pr-content {
  position: relative;
}

.medal {
  position: absolute;
  right: 0;
  width: 40px;
  height: 40px;
  top: -20px;
  z-index: 9999999999;
  display: block;
}

.hover-effect {
  background-image: url('../assets/hdefault.svg');
  position: absolute;
  width: 100px;
  background-size: cover;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30px;
  transform: translate(-120px, 0px);
  transition: 0.3s;
}

.pr-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin: 15px 0;
}

.pr-item {
  &:nth-child(1) {
    .hover-effect {
      background-image: url('../assets/hgold.svg');
    }
  }
  &:nth-child(2) {
    .hover-effect {
      background-image: url('../assets/hsilver.svg');
    }
  }
  &:nth-child(3) {
    .hover-effect {
      background-image: url('../assets/hbronze.svg');
    }
  }
  box-shadow: 0px 50px 100px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 5px;
  margin: 20px 0;
  background-color: #1d2c4e;
  position: relative;
  overflow: hidden;
}

.pr-username {
  color: #e6009a;
  font-weight: bold;
  font-size: 17px;
}

.pr-li {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.pr-rank {
  font-size: 50px;
  color: #c0c0c0;
}

.pr-link {
  text-decoration: none;
  color: #fff;
  padding: 0px;
  padding: 5px 14px;
  width: 30%;
  font-size: 14px;
  word-break: break-word;
  transition: 0.3s;
  &:hover {
    color: #5392fb;
  }
}

@media screen and (min-width: 768px) {
  .list-pull-request {
    text-align: center;
    width: 100%;
  }

  .pr-title {
    font-size: 28px;
  }

  .pr-list {
    margin-top: 30px;
    .pr-item {
      width: 50%;
      background-color: #1d2c4e;
      text-overflow: ellipsis;
      margin: 20px auto 20px auto;

      &:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        transform: scale(1.04, 1.04);
        margin: 30px auto;
        .hover-effect {
          transform: translate(-10px, 0px);
        }
      }
    }

    .pr-content {
      padding: 10px;
      list-style-type: none;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
