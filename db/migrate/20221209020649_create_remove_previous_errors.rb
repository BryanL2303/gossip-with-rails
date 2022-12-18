class CreateRemovePreviousErrors < ActiveRecord::Migration[7.0]
  def change
    change_table :accounts do |t|
      t.remove :calender_id
      t.remove :project_id 
    end
  end
end
