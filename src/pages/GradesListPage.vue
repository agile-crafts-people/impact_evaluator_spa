<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">Grades</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <ListPageSearch
          :searchable="true"
          :search-query="searchQuery"
          :debounced-search="debouncedSearch"
          automation-id="grade-list-search"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center">
        <v-btn 
          color="primary" 
          to="/grades/new"
          data-automation-id="grade-list-new-button"
        >
          <v-icon left>mdi-plus</v-icon>
          New Grade
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="(grades ?? []) as unknown as Grade[]"
            :loading="isLoading as unknown as boolean"
            @click:row="navigateToGrade"
            hover
            :items-per-page="-1"
            hide-default-footer
          >
            <template v-slot:header.name>
              <span style="cursor: pointer; user-select: none;" @click="handleSort('name')">
                Name
                <v-icon v-if="sortByValue === 'name'" size="small">
                  {{ orderValue === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
              </span>
            </template>
            <template v-slot:header.status>
              <span style="cursor: pointer; user-select: none;" @click="handleSort('status')">
                Status
                <v-icon v-if="sortByValue === 'status'" size="small">
                  {{ orderValue === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
              </span>
            </template>
            <template v-slot:header.created.at_time>
              <span style="cursor: pointer; user-select: none;" @click="handleSort('created.at_time')">
                Created
                <v-icon v-if="sortByValue === 'created.at_time'" size="small">
                  {{ orderValue === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
              </span>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip size="small">
                {{ item.status || 'N/A' }}
              </v-chip>
            </template>
            <template v-slot:item.created.at_time="{ item }">
              {{ formatDate(item.created.at_time) }}
            </template>
          </v-data-table>
          
          <!-- Load more button -->
          <v-card-actions v-if="hasMoreValue">
            <v-btn
              @click="loadMore"
              :loading="isFetchingNextPageValue"
              color="primary"
              block
              data-automation-id="grade-list-load-more"
            >
              {{ isFetchingNextPageValue ? 'Loading...' : 'Load More' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar :model-value="showError as unknown as boolean" color="error" :timeout="5000">
      Failed to load grades: {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
/**
 * Grades List Page - Powered by impact_spa_utils
 * 
 * This page uses useInfiniteScroll from @agile-crafts-people/impact_spa_utils
 * to get infinite scroll, search, and sorting with minimal code.
 */
import { computed } from 'vue'
import { api } from '@/api/client'
import { formatDate, ListPageSearch, useInfiniteScroll } from '@agile-crafts-people/impact_spa_utils'
import { useRouter } from 'vue-router'
import type { Grade } from '@/api/types'

const router = useRouter()

// 🎯 Single composable provides all list functionality
const {
  items: grades,
  isLoading,
  isFetchingNextPage,
  hasMore,
  loadMore,
  showError,
  errorMessage,
  searchQuery,
  debouncedSearch,
  sortBy,
  order,
  setSortBy,
  setOrder,
} = useInfiniteScroll<Grade>({
  queryKey: ['grades'],
  queryFn: (params) => api.getGrades(params),
  getItemId: (item) => item._id,
  limit: 20,
})

function navigateToGrade(_event: unknown, { item }: { item: Grade }) {
  router.push(`/grades/${item._id}`)
}

// Create computed properties for template use (TypeScript-friendly)
const sortByValue = computed(() => sortBy.value)
const orderValue = computed(() => order.value)
const hasMoreValue = computed(() => hasMore.value)
const isFetchingNextPageValue = computed(() => isFetchingNextPage.value)

function handleSort(field: string) {
  if (sortBy.value === field) {
    // Toggle order if same field
    setOrder(order.value === 'asc' ? 'desc' : 'asc')
  } else {
    // New field, default to ascending
    setSortBy(field)
    setOrder('asc')
  }
}

const headers = [
  { title: 'Name', key: 'name', sortable: false },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'created.at_time', sortable: false },
]

</script>