<template>
  <div>
    <h1 class="title">Customers</h1>
    <hr />
    <div class="row">
      <div class="col-md-12">
        <b-card>
          <div class="row">
            <div class="col">
              <b-card-title>List Customers</b-card-title>
            </div>
            <div class="col">
              <b-button
                variant="primary"
                size="sm"
                class="float-right"
                @click="slideFormCreate()"
              >
                <font-awesome-icon icon="plus" /> ADD NEW
              </b-button>
            </div>
          </div>
          <hr />
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
                ref="tabelCustomer"
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

                <template #cell(is_active)="row">
                  <span
                    :class="[
                      row.value === 'Active'
                        ? 'badge badge-success'
                        : 'badge badge-secondary',
                    ]"
                    >{{ row.value }}</span
                  >
                </template>

                <template #cell(actions)="row">
                  <b-button size="sm" @click="row.toggleDetails">
                    <font-awesome-icon
                      :icon="row.detailsShowing ? 'eye-slash' : 'eye'"
                    />
                  </b-button>
                  <b-button
                    variant="success"
                    size="sm"
                    @click="edit(row.item.id)"
                  >
                    <font-awesome-icon icon="edit" />
                  </b-button>
                  <b-button
                    variant="danger"
                    size="sm"
                    @click="destroy(row.item.id)"
                  >
                    <font-awesome-icon icon="trash" />
                  </b-button>
                </template>

                <template #row-details="row">
                  <b-card>
                    <table class="table table-striped table-hover">
                      <tbody>
                        <tr>
                          <td>Customer Code:</td>
                          <td>{{ row.item.customer_code }}</td>
                        </tr>
                        <tr>
                          <td>Customer Name:</td>
                          <td>{{ row.item.customer_name }}</td>
                        </tr>
                        <tr>
                          <td>Customer Email:</td>
                          <td>{{ row.item.email }}</td>
                        </tr>
                        <tr>
                          <td>Phone Number:</td>
                          <td>{{ row.item.phone_number }}</td>
                        </tr>
                        <tr>
                          <td>Group:</td>
                          <td>{{ row.item.group_name }}</td>
                        </tr>
                      </tbody>
                    </table>
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
    <form-create @events="fetchData"></form-create>
    <form-edit @events="fetchData"></form-edit>
  </div>
</template>

<script>
import FormCreate from '~/components/customer/FormCreate.vue'
import FormEdit from '~/components/customer/FormEdit.vue'
export default {
  components: { FormCreate, FormEdit },
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
        },
        {
          key: 'email',
          label: 'CUSTOMER EMAIL',
          sortable: true,
        },
        {
          key: 'is_active',
          label: 'STATUS',
          formatter: (value, key, item) => {
            return value ? 'Active' : 'Deactive'
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
      pageOptions: [5, 10, 15, 20, 50],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      from: 0,
      to: 0,
      filter: '',
      isFormCreate: true,
      isFormEdit: true,
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
      this.fetchData(newParams)
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
    slideFormCreate() {
      this.$store.commit('customer/SET_FORM_CREATE', this.isFormCreate)
    },
    edit(id) {
      const edit = { id_edit: id, is_form_edit: this.isFormEdit }
      this.$store.commit('customer/SET_FORM_EDIT', edit)
    },
    destroy(id) {
      this.$swal
        .fire({
          title: 'Hapus data customer?',
          html: 'Anda tidak dapat mengembalikan data yang sudah dihapus.',
          icon: 'warning',
          showLoaderOnConfirm: true,
          showCancelButton: true,
          confirmButtonColor: '#6c757d',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Hapus!',
          cancelButtonText: 'Batal',
          preConfirm: (confirm) => {
            return this.$axios
              .post('/api/customer/delete/' + id)
              .then((res) => {
                this.$swal.fire({
                  text: 'Data berhasil dihapus.',
                  icon: 'success',
                  allowOutsideClick: false,
                  preConfirm: (success) => {
                    this.fetchData(this.params)
                  },
                })
              })
              .catch((error) => {
                console.log(error.response)
                this.$swal.fire({
                  text: 'Terjadi kesalahan. Error:' + error,
                  icon: 'error',
                  allowOutsideClick: false,
                  preConfirm: (pre) => {
                    console.log(pre)
                  },
                })
              })
          },
          allowOutsideClick: () => !this.$swal.isLoading(),
        })
        .then((result) => {
          console.log(result)
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
