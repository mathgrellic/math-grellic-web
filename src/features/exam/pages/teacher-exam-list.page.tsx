import { useLoaderData } from 'react-router-dom';

import { capitalize } from '#/utils/string.util';
import { RecordStatus } from '#/core/models/core.model';
import { BaseDataToolbar } from '#/base/components/base-data-toolbar.component';
import { BaseDataPagination } from '#/base/components/base-data-pagination.component';
import { BaseRightSidebar } from '#/base/components/base-right-sidebar.component';
import { BaseDataSuspense } from '#/base/components/base-data-suspense.component';
import {
  defaultSort,
  useTeacherExamList,
} from '../hooks/use-teacher-exam-list.hook';
import { TeacherExamList } from '../components/teacher-exam-list.component';

const filterOptions = [
  {
    key: 'status-published',
    name: 'status',
    value: RecordStatus.Published,
    label: capitalize(RecordStatus.Published),
  },
  {
    key: 'status-draft',
    name: 'status',
    value: RecordStatus.Draft,
    label: capitalize(RecordStatus.Draft),
  },
];

const sortOptions = [
  {
    value: 'orderNumber',
    label: 'Exam Number',
  },
  {
    value: 'title',
    label: 'Exam Title',
  },
  {
    value: 'scheduleDate',
    label: 'Schedule Date',
  },
];

export function TeacherExamListPage() {
  const {
    exams,
    loading,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    totalCount,
    pagination,
    nextPage,
    prevPage,
    handleExamEdit,
    handleExamDetails,
    handleExamPreview,
    handleExamSchedule,
  } = useTeacherExamList();

  const data: any = useLoaderData();

  return (
    <BaseDataSuspense resolve={data?.main}>
      <div id='scene-content' className='flex w-full flex-1 items-start pt-5'>
        <div className='flex w-full flex-1 flex-col self-stretch'>
          <BaseDataToolbar
            className='mb-5'
            filterOptions={filterOptions}
            defaulSelectedtFilterOptions={filterOptions}
            defaultSelectedSort={defaultSort}
            sortOptions={sortOptions}
            onSearchChange={setKeyword}
            onRefresh={refresh}
            onFilter={setFilters}
            onSort={setSort}
          />
          <TeacherExamList
            exams={exams}
            loading={loading}
            onExamDetails={handleExamDetails}
            onExamPreview={handleExamPreview}
            onExamEdit={handleExamEdit}
            onExamSchedule={handleExamSchedule}
          />
          {!!totalCount && (
            <BaseDataPagination
              totalCount={totalCount}
              pagination={pagination}
              onNext={nextPage}
              onPrev={prevPage}
            />
          )}
        </div>
        {/* TODO sidebar components */}
        <BaseRightSidebar />
      </div>
    </BaseDataSuspense>
  );
}
