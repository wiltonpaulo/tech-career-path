$(document).ready(function () {
    // Função para buscar os hábitos na API e exibir na tabela
    function loadHabits() {
        $.ajax({
            url: '/habits',
            type: 'GET',
            success: function (response) {
                $('#habit-table-body').empty();
                response.forEach(function (habit) {
                    var row = `<tr>
                                    <td>${habit.id}</td>
                                    <td>${habit.name}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary edit-habit" data-id="${habit.id}">Edit</button>
                                        <button class="btn btn-sm btn-danger delete-habit" data-id="${habit.id}">Delete</button>
                                    </td>
                                </tr>`;
                    $('#habit-table-body').append(row);
                });
            }
        });
    }

    // Função para adicionar um hábito através da API
    $('#add-habit-form').submit(function (event) {
        event.preventDefault();
        var habitName = $('#habit-name').val();
        $.ajax({
            url: '/habits',
            type: 'POST',
            data: JSON.stringify({ name: habitName }),
            contentType: 'application/json',
            success: function () {
                $('#habit-name').val('');
                loadHabits();
            }
        });
    });

    // Função para editar um hábito através da API
    $(document).on('click', '.edit-habit', function () {
        var habitId = $(this).data('id');
        var newHabitName = prompt('Enter new habit name:');
        if (newHabitName) {
            $.ajax({
                url: `/habits/${habitId}`,
                type: 'PUT',
                data: JSON.stringify({ name: newHabitName }),
                contentType: 'application/json',
                success: function () {
                    loadHabits();
                }
            });
        }
    });

    // Função para deletar um hábito através da API
    $(document).on('click', '.delete-habit', function () {
        var habitId = $(this).data('id');
        if (confirm('Are you sure you want to delete this habit?')) {
            $.ajax({
                url: `/habits/${habitId}`,
                type: 'DELETE',
                success: function () {
                    loadHabits();
                }
            });
        }
    });

    // Carrega os hábitos ao carregar a página
    loadHabits();
});
