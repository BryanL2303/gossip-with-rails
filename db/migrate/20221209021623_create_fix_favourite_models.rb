class CreateFixFavouriteModels < ActiveRecord::Migration[7.0]
  def change
    change_table :topics do |t|
      t.remove :favourite_id
    end

    change_table :favourites do |t|
      t.integer :topic_id
    end
  end
end
