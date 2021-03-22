<template>
  <div>
    <h1 class="title">Customers</h1>
    <div class="row">
      <div class="col-md-12">
        <b-card>
          <b-card-title class="mb-3">List Customers</b-card-title>
          <div class="row my-3">
            <div class="col-md-4">
              <b-form-group
                label="Per page"
                label-for="per-page-select"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-form-select
                  id="per-page-select"
                  v-model="perPage"
                  :options="pageOptions"
                  size="sm"
                ></b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-8">
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Type to Search"
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''"
                      >Clear</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </div>
          <div class="row my-3">
            <div class="col-md-12">
              <b-table
                ref="tabel"
                striped
                hover
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="0"
                :filter="filter"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :busy="isBusy"
                stacked="md"
                show-empty
                outlined
              >
                <template #table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                  </div>
                </template>

                <template #cell(name)="row">
                  {{ row.value.customer_name }}
                </template>

                <template #cell(actions)="row">
                  <b-button size="sm" @click="row.toggleDetails">
                    {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                  </b-button>
                </template>

                <template #row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
            </div>
          </div>
          <div class="row justify-content-end">
            <div class="col-md-6">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
              ></b-pagination>
            </div>
          </div>
          <b-card-text class="small text-muted">
            Showing {{ from }} to {{ to }} of {{ totalRows }} rows
          </b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      fields: [
        {
          key: 'customer_code',
          label: 'CUSTOMER CODE',
          sortable: true,
          sortDirection: 'desc',
        },
        {
          key: 'customer_name',
          label: 'CUSTOMER NAME',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'email',
          label: 'CUSTOMER EMAIL',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'is_active',
          label: 'STATUS',
          formatter: (value, key, item) => {
            return value ? 'Active' : 'No'
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true,
        },
        { key: 'actions', label: 'Actions' },
      ],
      isBusy: false,
      items: this.items,
      totalRows: 0,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15, 20],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      from: 0,
      to: 0,
      filter: '',
    }
  },
  computed: {
    params() {
      let params = '?limit=' + this.perPage + '&page=' + this.currentPage
      if (this.sortBy) {
        params += '&sort=' + this.sortBy
        if (this.sortDesc) {
          params += '&order=DESC'
        }
      }
      if (this.filter !== '') {
        params += '&search=' + this.filter
      }
      return params
    },
  },
  watch: {
    params(newParams, oldParams) {
      console.log(newParams)
      this.fetchData(newParams)
      this.$refs.tabel.$forceUpdate()
    },
  },
  created() {
    this.fetchData(this.params) // initial fetch
  },
  methods: {
    fetchData(newParams) {
      this.isBusy = true
      this.items = []
      this.$axios
        .get('/api/customer' + newParams)
        .then((res) => {
          if (res.status === 200) {
            this.isBusy = false
            const data = res.data.data.items
            this.items = data
            this.from = res.data.page_info.from
            this.to = res.data.page_info.to
            this.totalRows = res.data.page_info.total
            return this.items
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style scoped>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
