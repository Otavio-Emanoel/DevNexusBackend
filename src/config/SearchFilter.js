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
                        sortOption = { createdAt: -1 };
                        break;
                    case 'oldest':
                        sortOption = { createdAt: 1 };
                        break;
                    default:
                        sortOption = { createdAt: -1 };
                }
            } else {
                sortOption = { createdAt: -1 };
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

    searchByName = async (searchTerm) => {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return []
            }

            const users = await User.find({
                name: { $regex: new RegExp(searchTerm.trim(), 'i') }
            })
                .select('-password')
                .sort({ createdAt: -1})
            return users
        } catch (error) {
            console.error('Erro na busca por nome:', error)
            throw error
        }
    }

}

module.exports = new SearchFilter()