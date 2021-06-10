import React from 'react'
import styled from 'styled-components'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useFlexLayout, useRowSelect, useResizeColumns, usePagination } from 'react-table'
// A great library for fuzzy filtering/sorting items
// import matchSorter from 'match-sorter'
import { Input, Button, Select, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
import moment from 'moment';
import { round, evaluate } from 'mathjs';
const Styles = styled.div`
padding: 1rem;
${'' /* These styles are suggested for the table fill all available space in its containing element */}
display: block;
${'' /* These styles are required for a horizontaly scrollable table overflow */}
overflow: auto;

.table {
  border-spacing: 0;
  border: 1px solid #bfbfbf;

  .thead {
    ${'' /* These styles are required for a scrollable body to align with the header properly */}
    overflow-y: auto;
    overflow-x: hidden;
  }

  .tbody {
    ${'' /* These styles are required for a scrollable table body */}
    overflow-y: scroll;
    overflow-x: hidden;
    height: 860px;
  }

  .tr {
    :last-child {
      .td {
        border-bottom: 0;
      }
    }
    border-bottom: 1px solid #bfbfbf;
  }

  .th,
  .td {
    margin: 0;
    padding: 0.3rem;
    border-right: 1px solid #bfbfbf;

    ${'' /* In this example we use an absolutely position resizer,
     so this is required. */}
    position: relative;

    :last-child {
      border-right: 0;
    }

    .resizer {
      right: 0;
      background: blue;
      width: 10px;
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      ${'' /* prevents from scrolling while dragging on touch devices */}
      touch-action :none;

      &.isResizing {
        background: red;
      }
    }
  }
}
`

const headerProps = (props, { column }) => getStyles(props, column.align)

const cellProps = (props, { cell }) => getStyles(props, cell.column.align)

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Tìm kiếm chung:{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} kết quả...`}
        style={{
          fontSize: '1rem',
          border: '0',
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter, width },
}) {
  const count = preFilteredRows.length
  return (
    <Input allowClear
      size="small"
      // style={{ width: width - 4 }}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Tìm ${count} phiếu...`}
    />
  )
}

// function trongLuongMethod(filter, row) {
//   // if (filter.value === "all") {
//   //   return true;
//   // }
//   // if (filter.value === "true") {
//   //   return row[filter.id] >= 21;
//   // }
//   // return row[filter.id] < 21;
//   console.log('OK');
// }



// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Input size="small"
        value={filterValue[0] || ''}
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          marginRight: '0.5rem',
        }}
      />
    </div>
  )
}

// function fuzzyTextFilterFn(rows, id, filterValue) {
//   return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
// }

// Let the table remove the filter if the string is empty
// fuzzyTextFilterFn.autoRemove = val => !val

// Our table component

function dateCell({ value }) {
  return value ? moment(value).format('DD/MM/YYYY') : ''
}
function dateHourCell({ value }) {
  return value ? moment(value).format('DD/MM/YYYY HH:mm') : ''
}
function tienCell({ value }) {
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''
}
function roundCell({ value }) {
  return value ? round(value, 3) : ''
}

function Table({ columns, data, onRowClicked }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    footerGroups,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 30 },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useFlexLayout,
    usePagination,
    useRowSelect,
    useResizeColumns,
  )

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(10)
  return (
    <div style={{ padding: 0 }}>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map(headerGroup => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className="tr thp"
            >
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps(headerProps)} className="th">
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {/* {column.canResize && (
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                )} */}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tbody">
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <div {...row.getRowProps()} className="tr" onClick={() => onRowClicked(row.values)}>
                {row.cells.map(cell => {
                  return <div {...cell.getCellProps()} className="td">{cell.render('Cell')}</div>
                })}
              </div>
            )
          })}
        </div>
        <div>
          {footerGroups.map(group => (
            <div {...group.getFooterGroupProps()} className="tr tft">
              {group.headers.map(column => (
                <div {...column.getFooterProps()} className="th">{column.render('Footer')}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        <Button size="small" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>{' '}
        <Button size="small" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>{' '}
        <Button size="small" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>{' '}
        <Button size="small" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>{' '}
        <span>
          Trang{' '}
          <strong>
            {pageIndex + 1} của {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Đi đến trang:{' '}
          <Input size="small"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select hidden
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Hiện {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

function dateRangFilter(props) {
  const {
    column: { filterValue = [], preFilteredRows, setFilter, id },
  } = props;
  // attach the onChange method from props's object to element
  const count = preFilteredRows.length;
  return (
    <RangePicker size="small" className="dateFilter"
      format={dateFormat}
    />
  )
}

function trongLuonFilter(props) {
  const {
    column: { filterValue = [], preFilteredRows, setFilter, id },
  } = props;
  // attach the onChange method from props's object to element
  const count = preFilteredRows.length;
  return (
    <Input allowClear
      size="small"
      // style={{ width: width - 4 }}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Tìm ${count} phiếu...`}
    />
  )
}


function filterTrongLuong(rows, id, filterValue) {
  const mtxt = /\<[\d]{1,99}([.]\d{1,99})?/g.test(filterValue);
  if (mtxt) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0]
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue < num
    })
  } else if (/\<=[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0]
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue <= num
    })
  } else if (/\>[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0]
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue > num
    })
  } else if (/\>=[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0]
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue >= num
    })
  } else if (/[\d]{1,99}([.]\d{1,99})?\-[\d]{1,99}([.]\d{1,99})?/g.test(filterValue)) {
    const num1 = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[0]
    const num2 = `${filterValue}`.match(/[\d]{1,99}([.]\d{1,99})?/g)[1]
    return rows.filter(row => {
      const rowValue = row.values[id]
      if (rowValue > num1 && rowValue < num2) {
        return row
      }
    })
  }
  else {
    return rows.filter(row => {
      const rowValue = row.values[id]
      return rowValue === Number(filterValue)
    })
  }

}




// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

function BangThongKe(props) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'id',
        accessor: 'id',
        width: 80
      },
      {
        Header: 'Số phiếu',
        accessor: 'sophieu',
        width: 80
      },
      {
        Header: 'Tên khách',
        accessor: 'tenkhach',
      },
      {
        Header: 'Món hàng',
        accessor: 'monhang',
        width: 150
      },
      {
        Header: 'Loại vàng',
        accessor: 'loaivang',
        Filter: SelectColumnFilter,
        filter: 'includes',
        width: 75
      },
      {
        Header: 'Tổng',
        accessor: 'tongtrongluong',
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        width: 80,
      },
      {
        Header: 'Hột',
        accessor: 'trongluonghot',
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        width: 80
      },
      {
        Header: 'Thực',
        accessor: 'trongluongthuc',
        Filter: trongLuonFilter,
        filter: filterTrongLuong,
        Cell: roundCell,
        width: 80
      },
      {
        Header: 'Ngày cầm',
        accessor: 'ngaycam',
        Cell: dateHourCell,
        Filter: dateRangFilter,
        width: 110
      },
      {
        Header: 'Ngày tính lãi',
        accessor: 'ngaytinhlai',
        Cell: dateCell,
        width: 90
      },
      {
        Header: 'Ngày hết hạn',
        accessor: 'ngayhethan',
        Cell: dateCell,
        width: 90
      },
      {
        Header: 'Tiền cầm',
        accessor: 'tiencam',
        Cell: tienCell,
        Footer: info => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.tiencam ? Number(row.values.tiencam | 0) + sum : sum, 0),
            [info.rows]
          )

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</>
        },
        width: 100
      },
      {
        Header: 'Lãi suất',
        accessor: 'laisuat',
        width: 60
      },
      {
        Header: 'Tiền lãi',
        accessor: 'tienlai',
        Cell: tienCell,
        Footer: info => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.tienlai ? Number(row.values.tienlai | 0) + sum : sum, 0),
            [info.rows]
          )

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</>
        },
        width: 100
      },
      {
        Header: 'Tiền chuộc',
        accessor: 'tienchuoc',
        Cell: tienCell,
        width: 100,
        Footer: info => {
          // Only calculate total visits if rows change
          console.log(info);
          const total = React.useMemo(
            () =>
              info.rows.reduce((sum, row) => row.values.tienchuoc ? Number(row.values.tienchuoc | 0) + sum : sum, 0),
            [info.rows]
          )

          return <>{`${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</>
        },
      },
      {
        Header: 'Ngày chuộc',
        accessor: 'ngaychuoc',
        Cell: dateHourCell,
        width: 125
      },
      {
        Header: 'Tủ đồ',
        accessor: 'tudo',
        width: 60
      },
      {
        Header: 'Trạng thái',
        accessor: 'trangthai',
        width: 100
      },
    ],
    []
  )

  const { data, onSelectRow } = props

  return (
    <Styles>
      <Table onRowClicked={(row) => onSelectRow(row)} filterable defaultFilterMethod={(filter, row) =>
        String(row[filter.id]) === filter.value} columns={columns} data={data} />
    </Styles>
  )
}

export default BangThongKe
