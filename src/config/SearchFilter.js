const User = require('../models/User')

class SearchFilter {
    filterUsers = async (query) => {
        try {
            let filterQuery = {}
            let sortOption = {}

            if (query.area && query.area !== '') {
                filterQuery.area = query.area.toLowerCase()
            }

            if (query.sortBy && query.sortBy !== '') {
                switch (query.sortBy) {
                    case 'newest': 
                        sortOption = { createdAt: -1};
                        break;
                        case 'oldest': 
                        sortOption = { createdAt: 1};
                        break;
                    default:
                        sortOption = { createdAt: -1};        
                    }
                } else {
                sortOption = { createdAt: -1};
            }
            console.log('Filtros aplicados: ', filterQuery)
            console.log('Ordenação: ', sortOption)


            const users = await User.find(filterQuery).sort(sortOption).select('-password')
            return users

        } catch (error) {
            console.error('Erro no SearchFilter: ', error)
            throw error
        }
    }
}

module.exports = new SearchFilter()