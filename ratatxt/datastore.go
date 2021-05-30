package ratatxt

// DatastoreCRUD provides basic datastore operation.
type DatastoreCRUD interface {
	List(rows, filter interface{}) error
	Get(row interface{}, id ID) error
	Create(input interface{}) error
	Update(input interface{}) error
	Delete(input interface{}) error
}

// SearchOpts represent search options.
type SearchOpts struct {
	Keyword       string
	KeywordFields []string
	Filter        interface{}
	UserID        ID
	Page          int
	Limit         int
	IndexSorting  bool
	Sort          string
	Desc          bool
}

// SearchMetadata represents search metadata.
type SearchMetadata struct {
	ResultCount int
	TotalCount  int
}

// DatastoreSearch provides search datastore operation.
type DatastoreSearch interface {
	Search(data interface{}, opts *SearchOpts) (*SearchMetadata, error)
	Count(model interface{}, opts *SearchOpts) (int, error)
}

type DataStoreUtil interface {
	AutoMigrate(obj ...interface{}) error
	//AutoIndex(obj ...interface{}) error
}

// Datastore provides basic and search datastore operations.
type Datastore interface {
	DatastoreSearch
	DatastoreCRUD
	DataStoreUtil

	// MessageStats Custom operations
	MessageStats(dst interface{}, scope StatsScope, filter *MessageFilter) error
	MessageGraph(dst interface{}, scope StatsScope, filter *MessageFilter) error
	OutboxGraph(dst interface{}, scope StatsScope, filter *MessageFilter) error
}
